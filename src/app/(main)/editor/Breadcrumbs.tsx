import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";

interface BreadcrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({ currentStep, setCurrentStep }: BreadcrumbsProps) {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {
            steps.map((step) => (
              <React.Fragment key={step.key}>
                <BreadcrumbItem>
                  {
                    step.key === currentStep
                      ? (<BreadcrumbPage className="font-bold">{step.title}</BreadcrumbPage>)
                      : (
                        <BreadcrumbLink asChild>
                          <button onClick={() => setCurrentStep(step.key)}>
                            <span className="text-xs lg:text:md font-roboto">{step.title}</span>
                          </button>
                        </BreadcrumbLink>
                      )
                  }
                </BreadcrumbItem>
                <BreadcrumbSeparator className="last:hidden" />
              </React.Fragment>
            ))
          }
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}