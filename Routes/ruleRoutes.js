import express from "express";
import {
  create_rule,
  evaluate_rule_api,
  combine_rules_api,
  get_all_rules,
  update_rule,
  delete_rule,
} from "../Controllers/ruleController.js";

const router = express.Router();

router.post("/create", create_rule);
router.post("/evaluate", evaluate_rule_api);
router.post("/combine", combine_rules_api);
router.get("/getallrules", get_all_rules);
router.put("/update/:id", update_rule);
router.delete("/delete/:id", delete_rule);

export default router;
