import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Evaluation from "../models/Evaluation.js";

const router = express.Router();

// Get team leader's team information
router.get("/team", requireAuth, requireRole(["team_leader"]), async (req, res) => {
  try {
    const team = await Team.findOne({ leader: req.user.id })
      .populate("leader", "firstName lastName email")
      .populate("members", "firstName lastName email jobTitle department phone");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const teamInfo = {
      id: team._id,
      name: team.name,
      department: team.department,
      description: team.description,
      leader: {
        id: team.leader._id,
        name: `${team.leader.firstName} ${team.leader.lastName}`,
        email: team.leader.email
      },
      members: team.members.map(member => ({
        id: member._id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        jobTitle: member.jobTitle,
        department: member.department,
        phone: member.phone
      })),
      memberCount: team.members.length,
      createdAt: team.createdAt
    };

    res.json(teamInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get team member details
router.get("/team/members/:memberId", requireAuth, requireRole(["team_leader"]), async (req, res) => {
  try {
    // Verify team leader has access to this member
    const team = await Team.findOne({ leader: req.user.id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.params.memberId)) {
      return res.status(403).json({ message: "Access denied to this member" });
    }

    const member = await User.findById(req.params.memberId)
      .select("firstName lastName email jobTitle department level phone address emergencyContact salary profileImage");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberInfo = {
      id: member._id,
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      jobTitle: member.jobTitle,
      department: member.department,
      level: member.level,
      phone: member.phone,
      address: member.address,
      emergencyContact: member.emergencyContact,
      salary: member.salary,
      profileImage: member.profileImage
    };

    res.json(memberInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get team performance summary
router.get("/team/performance", requireAuth, requireRole(["team_leader"]), async (req, res) => {
  try {
    const team = await Team.findOne({ leader: req.user.id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Get all evaluations for this team
    const evaluations = await Evaluation.find({ teamId: team._id })
      .populate("workRateEvaluations.memberId", "firstName lastName")
      .populate("behavioralEvaluations.evaluateeId", "firstName lastName");

    const performanceSummary = {
      totalEvaluations: evaluations.length,
      completedEvaluations: evaluations.filter(e => e.status === "completed").length,
      activeEvaluations: evaluations.filter(e => e.status === "active").length,
      draftEvaluations: evaluations.filter(e => e.status === "draft").length,
      
      // Work rate performance
      workRateEvaluations: evaluations
        .filter(e => e.type === "work_rate")
        .map(e => ({
          id: e._id,
          period: e.evaluationPeriod,
          status: e.status,
          averageScore: e.workRateEvaluations.length > 0 
            ? e.workRateEvaluations.reduce((sum, evaluationItem) => sum + (evaluationItem.weightedScore || 0), 0) / e.workRateEvaluations.length
            : 0,
          completedCount: e.workRateEvaluations.filter(evaluationItem => evaluationItem.evaluatedAt).length,
          totalCount: e.workRateEvaluations.length
        })),
      
      // Behavioral performance
      behavioralEvaluations: evaluations
        .filter(e => e.type === "behavioral")
        .map(e => ({
          id: e._id,
          period: e.evaluationPeriod,
          status: e.status,
          averageScore: e.behavioralEvaluations.length > 0
            ? e.behavioralEvaluations.reduce((sum, evaluationItem) => sum + (evaluationItem.totalScore || 0), 0) / e.behavioralEvaluations.length
            : 0,
          completedCount: e.behavioralEvaluations.filter(evaluationItem => evaluationItem.submittedAt).length,
          totalCount: e.behavioralEvaluations.length
        }))
    };

    res.json(performanceSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get team member performance history
router.get("/team/members/:memberId/performance", requireAuth, requireRole(["team_leader"]), async (req, res) => {
  try {
    // Verify team leader has access to this member
    const team = await Team.findOne({ leader: req.user.id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.params.memberId)) {
      return res.status(403).json({ message: "Access denied to this member" });
    }

    // Get all evaluations for this member
    const evaluations = await Evaluation.find({ teamId: team._id })
      .populate("workRateEvaluations.memberId", "firstName lastName")
      .populate("behavioralEvaluations.evaluateeId", "firstName lastName");

    const memberPerformance = {
      memberId: req.params.memberId,
      workRateHistory: [],
      behavioralHistory: []
    };

    // Extract work rate performance
    evaluations
      .filter(e => e.type === "work_rate")
      .forEach(evaluation => {
        const memberEval = evaluation.workRateEvaluations.find(
          evaluationItem => evaluationItem.memberId.toString() === req.params.memberId
        );
        
        if (memberEval) {
          memberPerformance.workRateHistory.push({
            evaluationId: evaluation._id,
            period: evaluation.evaluationPeriod,
            date: evaluation.startDate,
            totalScore: memberEval.totalScore,
            weightedScore: memberEval.weightedScore,
            criteria: memberEval.criteria,
            overallRemarks: memberEval.overallRemarks,
            status: evaluation.status
          });
        }
      });

    // Extract behavioral performance
    evaluations
      .filter(e => e.type === "behavioral")
      .forEach(evaluation => {
        const memberEvals = evaluation.behavioralEvaluations.filter(
          evaluationItem => evaluationItem.evaluateeId.toString() === req.params.memberId
        );
        
        if (memberEvals.length > 0) {
          memberPerformance.behavioralHistory.push({
            evaluationId: evaluation._id,
            period: evaluation.evaluationPeriod,
            date: evaluation.startDate,
            evaluations: memberEvals.map(evaluationItem => ({
              evaluatorType: evaluationItem.evaluatorType,
              evaluatorName: evaluationItem.evaluatorName,
              totalScore: evaluationItem.totalScore,
              criteria: evaluationItem.criteria,
              overallRemarks: evaluationItem.overallRemarks,
              submittedAt: evaluationItem.submittedAt
            })),
            status: evaluation.status
          });
        }
      });

    res.json(memberPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate team report
router.get("/team/report", requireAuth, requireRole(["team_leader"]), async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const team = await Team.findOne({ leader: req.user.id });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Build query
    const query = { teamId: team._id };
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }
    if (type) {
      query.type = type;
    }

    const evaluations = await Evaluation.find(query)
      .populate("workRateEvaluations.memberId", "firstName lastName")
      .populate("behavioralEvaluations.evaluateeId", "firstName lastName")
      .sort({ startDate: -1 });

    const report = {
      teamInfo: {
        name: team.name,
        department: team.department,
        leader: `${req.user.firstName} ${req.user.lastName}`,
        memberCount: team.members.length,
        reportPeriod: startDate && endDate ? `${startDate} to ${endDate}` : "All time"
      },
      
      summary: {
        totalEvaluations: evaluations.length,
        workRateEvaluations: evaluations.filter(e => e.type === "work_rate").length,
        behavioralEvaluations: evaluations.filter(e => e.type === "behavioral").length,
        completedEvaluations: evaluations.filter(e => e.status === "completed").length,
        activeEvaluations: evaluations.filter(e => e.status === "active").length
      },
      
      evaluations: evaluations.map(evaluation => {
        if (evaluation.type === "work_rate") {
          return {
            id: evaluation._id,
            type: "Work Rate",
            period: evaluation.evaluationPeriod,
            status: evaluation.status,
            startDate: evaluation.startDate,
            endDate: evaluation.endDate,
            memberEvaluations: evaluation.workRateEvaluations.map(evaluationItem => ({
              memberName: evaluationItem.memberName,
              totalScore: evaluationItem.totalScore,
              weightedScore: evaluationItem.weightedScore,
              criteria: evaluationItem.criteria,
              overallRemarks: evaluationItem.overallRemarks,
              evaluatedAt: evaluationItem.evaluatedAt
            })),
            averageScore: evaluation.workRateEvaluations.length > 0
              ? evaluation.workRateEvaluations.reduce((sum, evaluationItem) => sum + (evaluationItem.weightedScore || 0), 0) / evaluation.workRateEvaluations.length
              : 0
          };
        } else {
          return {
            id: evaluation._id,
            type: "Behavioral",
            period: evaluation.evaluationPeriod,
            status: evaluation.status,
            startDate: evaluation.startDate,
            endDate: evaluation.endDate,
            memberEvaluations: evaluation.behavioralEvaluations.map(evaluationItem => ({
              evaluatorType: evaluationItem.evaluatorType,
              evaluatorName: evaluationItem.evaluatorName,
              evaluateeName: evaluationItem.evaluateeName,
              totalScore: evaluationItem.totalScore,
              criteria: evaluationItem.criteria,
              overallRemarks: evaluationItem.overallRemarks,
              submittedAt: evaluationItem.submittedAt
            })),
            averageScore: evaluation.behavioralEvaluations.length > 0
              ? evaluation.behavioralEvaluations.reduce((sum, evaluationItem) => sum + (evaluationItem.totalScore || 0), 0) / evaluation.behavioralEvaluations.length
              : 0
          };
        }
      })
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
