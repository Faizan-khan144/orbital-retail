import {
  Armchair,
  BatteryCharging,
  Cable,
  HardDrive,
  Headphones,
  Keyboard,
  Lightbulb,
  Monitor,
  Package,
} from 'lucide-react'

const MAP = {
  Lighting: Lightbulb,
  Peripherals: Keyboard,
  Displays: Monitor,
  Accessories: Cable,
  Audio: Headphones,
  Storage: HardDrive,
  Power: BatteryCharging,
  Furniture: Armchair,
}

export const categoryIcon = (category) => MAP[category] ?? Package
