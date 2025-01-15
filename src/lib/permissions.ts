import { SubscriptionLevel } from "./subscription";

// TODO: Check resume count for non-premium users

export function canCreateResume(subscriptionLevel: SubscriptionLevel, currentResumeCount: number) {
  // ? Record<K, V> is a generic type that represents an object type whose property keys are of type K and whose property values are of type V.
  // literal keys: const maxResumeMap: Record<"free" | "pro", number> = {
  // generic type
  const maxResumeMap: Record<SubscriptionLevel, number> = {
    free: 2,
    pro: 10
    //pro_plus: Infinity
  }

  const maxResumes = maxResumeMap[subscriptionLevel] // 1, 3, Infinity

  return currentResumeCount < maxResumes // true, false
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel !== "free"
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
  //  return subscriptionLevel === "pro_plus"
  return subscriptionLevel == "free"
}
