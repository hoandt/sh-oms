"use client";

import React, { useMemo } from "react";
import { StepperBar } from "./components/Sidebar";
import { CreatingForm } from "./components/CreatingForm";

export default function Creating() {
  return (
    <div className="flex flex-row p-4 gap-5">
      <StepperBar />
      <CreatingForm />
    </div>
  );
}
