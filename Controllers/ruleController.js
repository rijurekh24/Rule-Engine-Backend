import Rule from "../Models/Rule.js";
import { RuleNode } from "../Models/RuleNode.js";

const parseRuleString = (ruleString) => {
  return new RuleNode("operand", null, null, ruleString);
};

export const create_rule = async (req, res) => {
  const { ruleString } = req.body;

  try {
    const ast = parseRuleString(ruleString);
    const rule = new Rule({ ruleString, ast });
    await rule.save();

    res.status(201).json({
      success: true,
      message: "Rule created successfully!",
      rule,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error creating rule: " + err.message,
    });
  }
};

const evaluate_rule = (ast, data) => {
  if (ast.type === "operand") {
    const expression = ast.value
      .replace(/AND/g, "&&")
      .replace(/OR/g, "||")
      .replace(/=/g, "===");

    return eval(
      expression.replace(
        /(age|department|salary|experience)/g,
        (match) => `data.${match}`
      )
    );
  } else if (ast.type === "operator") {
    const leftEval = evaluate_rule(ast.left, data);
    const rightEval = evaluate_rule(ast.right, data);
    return ast.value === "AND" ? leftEval && rightEval : leftEval || rightEval;
  }
  return false;
};

export const evaluate_rule_api = async (req, res) => {
  const { ruleId, data } = req.body;

  try {
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found." });
    }

    const result = evaluate_rule(rule.ast, data);
    res.json({ result });
  } catch (error) {
    console.error("Error evaluating rule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const combine_rules = (rules) => {
  let combinedAST = null;
  rules.forEach((rule) => {
    const ast = rule.ast;
    combinedAST = combinedAST
      ? new RuleNode("operator", combinedAST, ast, "OR")
      : ast;
  });
  return combinedAST;
};

export const combine_rules_api = async (req, res) => {
  const { ruleIds } = req.body;

  if (!ruleIds || !Array.isArray(ruleIds)) {
    return res.status(400).json({ message: "ruleIds must be an array" });
  }

  try {
    const fetchedRules = await Rule.find({ _id: { $in: ruleIds } });

    if (fetchedRules.length !== ruleIds.length) {
      return res.status(404).json({ message: "One or more rules not found." });
    }

    const combinedAST = combine_rules(fetchedRules);
    res.json({ combinedAST });
  } catch (error) {
    console.error("Error combining rules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const get_all_rules = async (req, res) => {
  try {
    const rules = await Rule.find();
    const formattedRules = rules.map((rule) => ({
      id: rule._id,
      ruleString: rule.ruleString,
    }));
    res.json(formattedRules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const update_rule = async (req, res) => {
  const { ruleString } = req.body;
  const { id } = req.params;

  try {
    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      { ruleString },
      { new: true }
    );
    if (!updatedRule) {
      return res.status(404).json({ message: "Rule not found." });
    }
    res.json(updatedRule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const delete_rule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRule = await Rule.findByIdAndDelete(id);
    if (!deletedRule) {
      return res.status(404).json({ message: "Rule not found." });
    }
    res.json({ message: "Rule deleted successfully." });
  } catch (error) {
    console.error("Error deleting rule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
