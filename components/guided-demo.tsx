"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { simulateGateway, gradeReply } from "@/lib/demo";
import orders from "@/lib/order-fixtures.json";
import cases from "@/lib/eval-fixtures.json";
import { labHref } from "@/lib/lab-routes";
export default function GuidedDemo({ index }: { index: number }) {
  const [choice, setChoice] = useState("first");
  const [ran, setRan] = useState(false);
  const isSecond = choice === "second";
  const gateway = simulateGateway(
    "woo__create_product",
    { name: "Demo notebook", regular_price: "12.50", status: "draft" },
    {
      role: isSecond ? "admin" : "member",
      key: "active",
      upstream: "connected",
      channel: "mcp",
    },
  );
  const order = isSecond ? orders["ORD-1010"] : orders["ORD-1004"];
  const reply = isSecond
    ? "Standard shipping does not take 5–7 days."
    : "Standard shipping takes 5–7 business days.";
  const grade = gradeReply(cases[0], reply);
  const titles = [
    "Can everyone create a product?",
    "What should the agent tell you?",
    "Would this reply pass the check?",
  ];
  const options = [
    ["Member role", "Admin role"],
    ["Cancelled order", "Shipment exception"],
    ["Expected answer", "A misleading answer"],
  ];
  return (
    <div className="guided-demo">
      <div className="guided-heading">
        <span>02 / EXPERIENCE · ABOUT 30 SECONDS</span>
        <span>Browser simulation</span>
      </div>
      <h4>{titles[index]}</h4>
      <label htmlFor={`guided-${index}`}>
        {
          [
            "Choose who is making the request",
            "Choose a source fixture",
            "Choose an agent reply",
          ][index]
        }
      </label>
      <select
        id={`guided-${index}`}
        value={choice}
        onChange={(e) => {
          setChoice(e.target.value);
          setRan(false);
        }}
      >
        <option value="first">{options[index][0]}</option>
        <option value="second">{options[index][1]}</option>
      </select>
      {index === 2 && <p className="guided-reply">“{reply}”</p>}
      <div className="guided-actions">
        <button onClick={() => setRan(true)}>
          <Play size={12} />
          {
            [
              "Try the permission check",
              "Inspect the safe output",
              "Check the reply",
            ][index]
          }
        </button>
        {ran && (
          <button
            className="guided-reset"
            onClick={() => {
              setChoice("first");
              setRan(false);
            }}
            aria-label="Reset guided demo"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
      <div className="guided-result" role="status">
        {!ran ? (
          <span>
            Choose an option and run the example. Nothing leaves your browser.
          </span>
        ) : index === 0 ? (
          <>
            <strong>
              {gateway.status === "Role denied"
                ? "Denied before the store."
                : "Allowed by the role check."}
            </strong>
            <p>
              {gateway.status === "Role denied"
                ? "A member cannot use the admin-only create_product tool. The simulated attempt is recorded as an error."
                : "The simulated admin call returns a fictional draft product. No real product is created."}
            </p>
          </>
        ) : index === 1 ? (
          <>
            <strong>
              {order.status === "cancelled"
                ? "A cancelled order needs no delivery estimate."
                : "This needs a human handoff."}
            </strong>
            <p>
              {order.status === "cancelled"
                ? "The actual order tool removes stale shipment and ETA fields before the model sees them. This is a replay of its safe output."
                : "The actual order tool marks this exception with requires_handoff: true. The model does not have to infer that rule."}
            </p>
          </>
        ) : (
          <>
            <strong>
              {grade.passed ? "PASS — but read the answer." : "FAIL"}
            </strong>
            <p>
              {isSecond
                ? "The answer denies the policy but contains “5–7”, so the source keyword check passes it. Matching words is not the same as understanding them."
                : "The required shipping phrase matched. This local check cannot judge the meaning of a whole conversation."}
            </p>
          </>
        )}
      </div>
      <Link href={labHref(index)}>
        03 / INVESTIGATE · Open the complete lab <ArrowRight size={14} />
      </Link>
    </div>
  );
}
