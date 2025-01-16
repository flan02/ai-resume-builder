/* eslint-disable @typescript-eslint/no-explicit-any */
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";

// $ This component contains the preview of the resume that the user is creating.
interface ResumePreviewProps {
  resumeData: ResumeValues
  contentRef?: React.Ref<HTMLDivElement>
  className?: string
}

export default function ResumePreview({ resumeData, contentRef, className }: ResumePreviewProps) {

  //const containerRef = useRef<HTMLDivElement>(null) // document.createElement("div")
  const containerRef = useRef<any>(null)
  const { width } = useDimensions(containerRef)

  // | aspect ratio 210/297 = 0.7070707070707071 (A4 paper)
  return (
    <div className={cn(
      "aspect-[210/297] h-fit w-full bg-white text-black",
      className
    )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }} // ? Rezise the content to fit the A4 paper
        ref={contentRef}
        id="resumePreviewContent" // ? tagged for css
      >
        {/* <pre>{JSON.stringify(resumeData, null, 2)}</pre> */}
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
}

// * The following components are used to display the different sections of the resume.

interface ResumeSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {

  const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle } = resumeData
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo) // ? Set the photo source. It can be File, String, Null, or Undefined

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ""
    if (objectUrl) setPhotoSrc(objectUrl)
    if (photo === null) setPhotoSrc("")
    return () => URL.revokeObjectURL(objectUrl) // ? Revoke the object URL when the component is unmounted
  }, [photo])

  return (
    <div className="flex items-center gap-6">
      {
        photoSrc && (
          <Image
            src={photoSrc}
            width={100}
            height={100}
            alt="Author photo"
            className="aspect-square object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "10%"
            }}
          />
        )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p className="font-medium" style={{ color: colorHex }}>
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }} >
          Perfil Profesional
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  )
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0) // ? Check all values at the same time guarantees that the object is not empty

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }} >
          Experiencia Laboral
        </p>
        {
          workExperiencesNotEmpty.map((exp, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: colorHex
                }}
              >
                <span>{exp.position}</span>
                {
                  exp.startDate && (
                    <span>
                      {formatDate(exp.startDate, "MM/aaaa")} -{" "}
                      {exp.endDate ? formatDate(exp.endDate, "MM/aaaa") : "Present"}
                    </span>
                  )
                }
              </div>
              <p className="text-xs font-semibold">{exp.company}</p>
              <div className="whitespace-pre-line text-xs">{exp.description}</div>
            </div>
          ))
        }
      </div>
    </>
  )
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData

  const educationsNotEmpty = educations?.filter((edu) => Object.values(edu).filter(Boolean).length > 0)

  if (!educationsNotEmpty?.length) return null

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex
          }}
        >
          Educacion
        </p>
        {
          educationsNotEmpty.map((edu, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: colorHex
                }}
              >
                <span>{edu.degree}</span>
                {
                  edu.startDate && (
                    <span>
                      {
                        edu.startDate && `${formatDate(edu.startDate, "MM/aaaa")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/aaaa")}` : ""}`
                      }
                    </span>
                  )
                }
              </div>
              <p className="text-xs font-semibold">{edu.school}</p>
            </div>
          ))
        }
      </div>
    </>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData

  if (!skills?.length) return null

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }} >
          Habilidades
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {
            skills.map((skill, index) => (
              <Badge
                key={index}
                className="rounded-md bg-black text-white hover:bg-black"
                style={{
                  backgroundColor: colorHex,
                  borderRadius:
                    borderStyle === BorderStyles.SQUARE
                      ? "0px"
                      : borderStyle === BorderStyles.CIRCLE
                        ? "9999px"
                        : "8px"
                }}
              >
                {skill}
              </Badge>
            ))
          }
        </div>
      </div>
    </>
  )
}