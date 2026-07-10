import analgesik from "@/assets/med/analgesik.jpg";
import antibiotik from "@/assets/med/antibiotik.jpg";
import vitamin from "@/assets/med/vitamin.jpg";
import antasida from "@/assets/med/antasida.jpg";
import antihistamin from "@/assets/med/antihistamin.jpg";
import batuk from "@/assets/med/batuk.jpg";
import suplemen from "@/assets/med/suplemen.jpg";
import salep from "@/assets/med/salep.jpg";

const byCategory: Record<string, string> = {
  Analgesik: analgesik,
  Antibiotik: antibiotik,
  Vitamin: vitamin,
  Antasida: antasida,
  Antihistamin: antihistamin,
  "Batuk & Flu": batuk,
  Suplemen: suplemen,
  Salep: salep,
};

export function medImage(category: string): string {
  return byCategory[category] ?? suplemen;
}
