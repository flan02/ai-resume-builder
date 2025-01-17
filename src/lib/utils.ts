import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "@/lib/types";
import { ResumeValues } from "@/lib/validation";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified
    }
    : value
}

export function isSessionActive(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000) // in seconds
  return exp > currentTime
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000) // in milliseconds
  return date.toLocaleString() // e.g. 9/17/2021, 1:00:00 PM
}

export function getTimeRemaining(exp: number, unit: "d" | "h" | "m" | "s") {
  const currentTime = Math.floor(Date.now() / 1000) // in seconds
  const secondsRemaining = exp - currentTime
  if (secondsRemaining <= 0) return 0
  switch (unit) {
    case "d":
      return Math.floor(secondsRemaining / 86400)
    case "h":
      return Math.floor(secondsRemaining / 3600)
    case "m":
      return Math.floor(secondsRemaining / 60)
    case "s":
    default:
      return secondsRemaining
  }
}

export function getFormattedTimeRemaining(exp: number): string {
  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos (UNIX timestamp)
  const timeRemainingInSeconds = exp - currentTime; // Calcula el tiempo restante en segundos

  if (timeRemainingInSeconds <= 0) {
    return "El token ya ha expirado";
  }

  const days = Math.floor(timeRemainingInSeconds / (60 * 60 * 24));
  const hours = Math.floor((timeRemainingInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((timeRemainingInSeconds % (60 * 60)) / 60);
  const seconds = timeRemainingInSeconds % 60;

  // Formatear el resultado
  return `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photoUrl: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined
  }
}