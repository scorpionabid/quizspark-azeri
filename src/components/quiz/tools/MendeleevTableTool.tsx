import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide';

export interface ChemicalElement {
  z: number;
  symbol: string;
  name: string;
  ar: number | string;
  period: number;
  group: string;
  col: number; // 1..18 in standard periodic table
  row: number; // 1..7 for main table, 8 for Lanthanides, 9 for Actinides
  category: ElementCategory;
  valency?: string;
}

const CATEGORY_META: Record<
  ElementCategory,
  { label: string; badgeClass: string; cellClass: string }
> = {
  alkali: {
    label: 'Qələvi metal',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    cellClass: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/40 text-rose-900 dark:text-rose-100',
  },
  alkaline: {
    label: 'Qələvi-torpaq metalı',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    cellClass: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/40 text-orange-900 dark:text-orange-100',
  },
  transition: {
    label: 'Keçid metalı (d-element)',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    cellClass: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-900 dark:text-amber-100',
  },
  'post-transition': {
    label: 'Əsas yarımqrup metalı',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    cellClass: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-900 dark:text-emerald-100',
  },
  metalloid: {
    label: 'Yarımmetal',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    cellClass: 'bg-teal-500/15 hover:bg-teal-500/25 border-teal-500/40 text-teal-900 dark:text-teal-100',
  },
  nonmetal: {
    label: 'Qeyri-metal',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    cellClass: 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/40 text-sky-900 dark:text-sky-100',
  },
  halogen: {
    label: 'Halogen',
    badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    cellClass: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/40 text-indigo-900 dark:text-indigo-100',
  },
  noble: {
    label: 'Təsirsiz (nəcib) qaz',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    cellClass: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-900 dark:text-purple-100',
  },
  lanthanide: {
    label: 'Lantanoid',
    badgeClass: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30',
    cellClass: 'bg-pink-500/15 hover:bg-pink-500/25 border-pink-500/40 text-pink-900 dark:text-pink-100',
  },
  actinide: {
    label: 'Aktinoid',
    badgeClass: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
    cellClass: 'bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border-fuchsia-500/40 text-fuchsia-900 dark:text-fuchsia-100',
  },
};

export const ELEMENTS: ChemicalElement[] = [
  // Period 1
  { z: 1, symbol: 'H', name: 'Hidrogen', ar: 1, period: 1, group: 'I A (VII A)', col: 1, row: 1, category: 'nonmetal', valency: 'I' },
  { z: 2, symbol: 'He', name: 'Helium', ar: 4, period: 1, group: 'VIII A', col: 18, row: 1, category: 'noble', valency: '0' },

  // Period 2
  { z: 3, symbol: 'Li', name: 'Litium', ar: 7, period: 2, group: 'I A', col: 1, row: 2, category: 'alkali', valency: 'I' },
  { z: 4, symbol: 'Be', name: 'Berillium', ar: 9, period: 2, group: 'II A', col: 2, row: 2, category: 'alkaline', valency: 'II' },
  { z: 5, symbol: 'B', name: 'Bor', ar: 11, period: 2, group: 'III A', col: 13, row: 2, category: 'metalloid', valency: 'III' },
  { z: 6, symbol: 'C', name: 'Karbon', ar: 12, period: 2, group: 'IV A', col: 14, row: 2, category: 'nonmetal', valency: 'IV (II)' },
  { z: 7, symbol: 'N', name: 'Azot', ar: 14, period: 2, group: 'V A', col: 15, row: 2, category: 'nonmetal', valency: 'III, IV (I–IV)' },
  { z: 8, symbol: 'O', name: 'Oksigen', ar: 16, period: 2, group: 'VI A', col: 16, row: 2, category: 'nonmetal', valency: 'II (III)' },
  { z: 9, symbol: 'F', name: 'Flüor', ar: 19, period: 2, group: 'VII A', col: 17, row: 2, category: 'halogen', valency: 'I' },
  { z: 10, symbol: 'Ne', name: 'Neon', ar: 20, period: 2, group: 'VIII A', col: 18, row: 2, category: 'noble', valency: '0' },

  // Period 3
  { z: 11, symbol: 'Na', name: 'Natrium', ar: 23, period: 3, group: 'I A', col: 1, row: 3, category: 'alkali', valency: 'I' },
  { z: 12, symbol: 'Mg', name: 'Maqnezium', ar: 24, period: 3, group: 'II A', col: 2, row: 3, category: 'alkaline', valency: 'II' },
  { z: 13, symbol: 'Al', name: 'Alüminium', ar: 27, period: 3, group: 'III A', col: 13, row: 3, category: 'post-transition', valency: 'III' },
  { z: 14, symbol: 'Si', name: 'Silisium', ar: 28, period: 3, group: 'IV A', col: 14, row: 3, category: 'metalloid', valency: 'IV (II)' },
  { z: 15, symbol: 'P', name: 'Fosfor', ar: 31, period: 3, group: 'V A', col: 15, row: 3, category: 'nonmetal', valency: 'III, V' },
  { z: 16, symbol: 'S', name: 'Kükürd', ar: 32, period: 3, group: 'VI A', col: 16, row: 3, category: 'nonmetal', valency: 'II, IV, VI' },
  { z: 17, symbol: 'Cl', name: 'Xlor', ar: 35.5, period: 3, group: 'VII A', col: 17, row: 3, category: 'halogen', valency: 'I, III, V, VII' },
  { z: 18, symbol: 'Ar', name: 'Arqon', ar: 40, period: 3, group: 'VIII A', col: 18, row: 3, category: 'noble', valency: '0' },

  // Period 4
  { z: 19, symbol: 'K', name: 'Kalium', ar: 39, period: 4, group: 'I A', col: 1, row: 4, category: 'alkali', valency: 'I' },
  { z: 20, symbol: 'Ca', name: 'Kalsium', ar: 40, period: 4, group: 'II A', col: 2, row: 4, category: 'alkaline', valency: 'II' },
  { z: 21, symbol: 'Sc', name: 'Skandium', ar: 45, period: 4, group: 'III B', col: 3, row: 4, category: 'transition', valency: 'III' },
  { z: 22, symbol: 'Ti', name: 'Titan', ar: 48, period: 4, group: 'IV B', col: 4, row: 4, category: 'transition', valency: 'II, III, IV' },
  { z: 23, symbol: 'V', name: 'Vanadium', ar: 51, period: 4, group: 'V B', col: 5, row: 4, category: 'transition', valency: 'II, III, IV, V' },
  { z: 24, symbol: 'Cr', name: 'Xrom', ar: 52, period: 4, group: 'VI B', col: 6, row: 4, category: 'transition', valency: 'II, III, VI' },
  { z: 25, symbol: 'Mn', name: 'Manqan', ar: 55, period: 4, group: 'VII B', col: 7, row: 4, category: 'transition', valency: 'II, III, IV, VI, VII' },
  { z: 26, symbol: 'Fe', name: 'Dəmir', ar: 56, period: 4, group: 'VIII B', col: 8, row: 4, category: 'transition', valency: 'II, III (VI)' },
  { z: 27, symbol: 'Co', name: 'Kobalt', ar: 59, period: 4, group: 'VIII B', col: 9, row: 4, category: 'transition', valency: 'II, III' },
  { z: 28, symbol: 'Ni', name: 'Nikel', ar: 59, period: 4, group: 'VIII B', col: 10, row: 4, category: 'transition', valency: 'II, III' },
  { z: 29, symbol: 'Cu', name: 'Mis', ar: 64, period: 4, group: 'I B', col: 11, row: 4, category: 'transition', valency: 'I, II' },
  { z: 30, symbol: 'Zn', name: 'Sink', ar: 65, period: 4, group: 'II B', col: 12, row: 4, category: 'transition', valency: 'II' },
  { z: 31, symbol: 'Ga', name: 'Qallium', ar: 70, period: 4, group: 'III A', col: 13, row: 4, category: 'post-transition', valency: 'III' },
  { z: 32, symbol: 'Ge', name: 'Germanium', ar: 73, period: 4, group: 'IV A', col: 14, row: 4, category: 'metalloid', valency: 'II, IV' },
  { z: 33, symbol: 'As', name: 'Arsen', ar: 75, period: 4, group: 'V A', col: 15, row: 4, category: 'metalloid', valency: 'III, V' },
  { z: 34, symbol: 'Se', name: 'Selen', ar: 79, period: 4, group: 'VI A', col: 16, row: 4, category: 'nonmetal', valency: 'II, IV, VI' },
  { z: 35, symbol: 'Br', name: 'Brom', ar: 80, period: 4, group: 'VII A', col: 17, row: 4, category: 'halogen', valency: 'I, III, V, VII' },
  { z: 36, symbol: 'Kr', name: 'Kripton', ar: 84, period: 4, group: 'VIII A', col: 18, row: 4, category: 'noble', valency: '0 (II)' },

  // Period 5
  { z: 37, symbol: 'Rb', name: 'Rubidium', ar: 85, period: 5, group: 'I A', col: 1, row: 5, category: 'alkali', valency: 'I' },
  { z: 38, symbol: 'Sr', name: 'Stronsium', ar: 88, period: 5, group: 'II A', col: 2, row: 5, category: 'alkaline', valency: 'II' },
  { z: 39, symbol: 'Y', name: 'İttrium', ar: 89, period: 5, group: 'III B', col: 3, row: 5, category: 'transition', valency: 'III' },
  { z: 40, symbol: 'Zr', name: 'Sirkonium', ar: 91, period: 5, group: 'IV B', col: 4, row: 5, category: 'transition', valency: 'IV' },
  { z: 41, symbol: 'Nb', name: 'Niobium', ar: 93, period: 5, group: 'V B', col: 5, row: 5, category: 'transition' },
  { z: 42, symbol: 'Mo', name: 'Molibden', ar: 96, period: 5, group: 'VI B', col: 6, row: 5, category: 'transition' },
  { z: 43, symbol: 'Tc', name: 'Texnesium', ar: 98, period: 5, group: 'VII B', col: 7, row: 5, category: 'transition' },
  { z: 44, symbol: 'Ru', name: 'Rutenium', ar: 101, period: 5, group: 'VIII B', col: 8, row: 5, category: 'transition' },
  { z: 45, symbol: 'Rh', name: 'Rodium', ar: 103, period: 5, group: 'VIII B', col: 9, row: 5, category: 'transition' },
  { z: 46, symbol: 'Pd', name: 'Palladium', ar: 106, period: 5, group: 'VIII B', col: 10, row: 5, category: 'transition' },
  { z: 47, symbol: 'Ag', name: 'Gümüş', ar: 108, period: 5, group: 'I B', col: 11, row: 5, category: 'transition', valency: 'I' },
  { z: 48, symbol: 'Cd', name: 'Kadmium', ar: 112, period: 5, group: 'II B', col: 12, row: 5, category: 'transition', valency: 'II' },
  { z: 49, symbol: 'In', name: 'İndium', ar: 115, period: 5, group: 'III A', col: 13, row: 5, category: 'post-transition' },
  { z: 50, symbol: 'Sn', name: 'Qalay', ar: 119, period: 5, group: 'IV A', col: 14, row: 5, category: 'post-transition', valency: 'II, IV' },
  { z: 51, symbol: 'Sb', name: 'Stibium', ar: 122, period: 5, group: 'V A', col: 15, row: 5, category: 'metalloid', valency: 'III, V' },
  { z: 52, symbol: 'Te', name: 'Tellur', ar: 128, period: 5, group: 'VI A', col: 16, row: 5, category: 'metalloid', valency: 'II, IV, VI' },
  { z: 53, symbol: 'I', name: 'Yod', ar: 127, period: 5, group: 'VII A', col: 17, row: 5, category: 'halogen', valency: 'I, III, V, VII' },
  { z: 54, symbol: 'Xe', name: 'Ksenon', ar: 131, period: 5, group: 'VIII A', col: 18, row: 5, category: 'noble', valency: '0 (II, IV, VI, VIII)' },

  // Period 6
  { z: 55, symbol: 'Cs', name: 'Sezium', ar: 133, period: 6, group: 'I A', col: 1, row: 6, category: 'alkali', valency: 'I' },
  { z: 56, symbol: 'Ba', name: 'Barium', ar: 137, period: 6, group: 'II A', col: 2, row: 6, category: 'alkaline', valency: 'II' },
  { z: 57, symbol: 'La', name: 'Lantan', ar: 139, period: 6, group: 'III B', col: 3, row: 6, category: 'lanthanide', valency: 'III' },
  { z: 72, symbol: 'Hf', name: 'Hafnium', ar: 178.5, period: 6, group: 'IV B', col: 4, row: 6, category: 'transition' },
  { z: 73, symbol: 'Ta', name: 'Tantal', ar: 181, period: 6, group: 'V B', col: 5, row: 6, category: 'transition' },
  { z: 74, symbol: 'W', name: 'Volfram', ar: 184, period: 6, group: 'VI B', col: 6, row: 6, category: 'transition' },
  { z: 75, symbol: 'Re', name: 'Renium', ar: 186, period: 6, group: 'VII B', col: 7, row: 6, category: 'transition' },
  { z: 76, symbol: 'Os', name: 'Osmium', ar: 190, period: 6, group: 'VIII B', col: 8, row: 6, category: 'transition' },
  { z: 77, symbol: 'Ir', name: 'İridium', ar: 192, period: 6, group: 'VIII B', col: 9, row: 6, category: 'transition' },
  { z: 78, symbol: 'Pt', name: 'Platin', ar: 195, period: 6, group: 'VIII B', col: 10, row: 6, category: 'transition', valency: 'II, IV' },
  { z: 79, symbol: 'Au', name: 'Qızıl', ar: 197, period: 6, group: 'I B', col: 11, row: 6, category: 'transition', valency: 'I, III' },
  { z: 80, symbol: 'Hg', name: 'Civə', ar: 201, period: 6, group: 'II B', col: 12, row: 6, category: 'transition', valency: 'I, II' },
  { z: 81, symbol: 'Tl', name: 'Tallium', ar: 204, period: 6, group: 'III A', col: 13, row: 6, category: 'post-transition' },
  { z: 82, symbol: 'Pb', name: 'Qurğuşun', ar: 207, period: 6, group: 'IV A', col: 14, row: 6, category: 'post-transition', valency: 'II, IV' },
  { z: 83, symbol: 'Bi', name: 'Bismut', ar: 209, period: 6, group: 'V A', col: 15, row: 6, category: 'post-transition', valency: 'III, V' },
  { z: 84, symbol: 'Po', name: 'Polonium', ar: 209, period: 6, group: 'VI A', col: 16, row: 6, category: 'post-transition' },
  { z: 85, symbol: 'At', name: 'Astat', ar: 210, period: 6, group: 'VII A', col: 17, row: 6, category: 'halogen' },
  { z: 86, symbol: 'Rn', name: 'Radon', ar: 222, period: 6, group: 'VIII A', col: 18, row: 6, category: 'noble' },

  // Period 7
  { z: 87, symbol: 'Fr', name: 'Fransium', ar: 223, period: 7, group: 'I A', col: 1, row: 7, category: 'alkali', valency: 'I' },
  { z: 88, symbol: 'Ra', name: 'Radium', ar: 226, period: 7, group: 'II A', col: 2, row: 7, category: 'alkaline', valency: 'II' },
  { z: 89, symbol: 'Ac', name: 'Aktinium', ar: 227, period: 7, group: 'III B', col: 3, row: 7, category: 'actinide', valency: 'III' },
  { z: 104, symbol: 'Rf', name: 'Rezerfordium', ar: 267, period: 7, group: 'IV B', col: 4, row: 7, category: 'transition' },
  { z: 105, symbol: 'Db', name: 'Dubnium', ar: 268, period: 7, group: 'V B', col: 5, row: 7, category: 'transition' },
  { z: 106, symbol: 'Sg', name: 'Siborgium', ar: 269, period: 7, group: 'VI B', col: 6, row: 7, category: 'transition' },
  { z: 107, symbol: 'Bh', name: 'Borium', ar: 270, period: 7, group: 'VII B', col: 7, row: 7, category: 'transition' },
  { z: 108, symbol: 'Hs', name: 'Hassium', ar: 277, period: 7, group: 'VIII B', col: 8, row: 7, category: 'transition' },
  { z: 109, symbol: 'Mt', name: 'Meytnerium', ar: 278, period: 7, group: 'VIII B', col: 9, row: 7, category: 'transition' },
  { z: 110, symbol: 'Ds', name: 'Darmştadtium', ar: 281, period: 7, group: 'VIII B', col: 10, row: 7, category: 'transition' },
  { z: 111, symbol: 'Rg', name: 'Rentgenium', ar: 282, period: 7, group: 'I B', col: 11, row: 7, category: 'transition' },
  { z: 112, symbol: 'Cn', name: 'Kopernisium', ar: 285, period: 7, group: 'II B', col: 12, row: 7, category: 'transition' },
  { z: 113, symbol: 'Nh', name: 'Nihonium', ar: 286, period: 7, group: 'III A', col: 13, row: 7, category: 'post-transition' },
  { z: 114, symbol: 'Fl', name: 'Flerovium', ar: 289, period: 7, group: 'IV A', col: 14, row: 7, category: 'post-transition' },
  { z: 115, symbol: 'Mc', name: 'Moskovium', ar: 290, period: 7, group: 'V A', col: 15, row: 7, category: 'post-transition' },
  { z: 116, symbol: 'Lv', name: 'Livermorium', ar: 293, period: 7, group: 'VI A', col: 16, row: 7, category: 'post-transition' },
  { z: 117, symbol: 'Ts', name: 'Tennessin', ar: 294, period: 7, group: 'VII A', col: 17, row: 7, category: 'halogen' },
  { z: 118, symbol: 'Og', name: 'Oqaneson', ar: 294, period: 7, group: 'VIII A', col: 18, row: 7, category: 'noble' },

  // Lanthanides (Row 8, cols 4..17)
  { z: 58, symbol: 'Ce', name: 'Serium', ar: 140, period: 6, group: 'Lantanoid', col: 4, row: 8, category: 'lanthanide' },
  { z: 59, symbol: 'Pr', name: 'Prazeodim', ar: 141, period: 6, group: 'Lantanoid', col: 5, row: 8, category: 'lanthanide' },
  { z: 60, symbol: 'Nd', name: 'Neodim', ar: 144, period: 6, group: 'Lantanoid', col: 6, row: 8, category: 'lanthanide' },
  { z: 61, symbol: 'Pm', name: 'Prometium', ar: 145, period: 6, group: 'Lantanoid', col: 7, row: 8, category: 'lanthanide' },
  { z: 62, symbol: 'Sm', name: 'Samarium', ar: 150, period: 6, group: 'Lantanoid', col: 8, row: 8, category: 'lanthanide' },
  { z: 63, symbol: 'Eu', name: 'Avropium', ar: 152, period: 6, group: 'Lantanoid', col: 9, row: 8, category: 'lanthanide' },
  { z: 64, symbol: 'Gd', name: 'Qadolinium', ar: 157, period: 6, group: 'Lantanoid', col: 10, row: 8, category: 'lanthanide' },
  { z: 65, symbol: 'Tb', name: 'Terbium', ar: 159, period: 6, group: 'Lantanoid', col: 11, row: 8, category: 'lanthanide' },
  { z: 66, symbol: 'Dy', name: 'Disprozium', ar: 162.5, period: 6, group: 'Lantanoid', col: 12, row: 8, category: 'lanthanide' },
  { z: 67, symbol: 'Ho', name: 'Holmium', ar: 165, period: 6, group: 'Lantanoid', col: 13, row: 8, category: 'lanthanide' },
  { z: 68, symbol: 'Er', name: 'Erbium', ar: 167, period: 6, group: 'Lantanoid', col: 14, row: 8, category: 'lanthanide' },
  { z: 69, symbol: 'Tm', name: 'Tulium', ar: 169, period: 6, group: 'Lantanoid', col: 15, row: 8, category: 'lanthanide' },
  { z: 70, symbol: 'Yb', name: 'İtterbium', ar: 173, period: 6, group: 'Lantanoid', col: 16, row: 8, category: 'lanthanide' },
  { z: 71, symbol: 'Lu', name: 'Lütesium', ar: 175, period: 6, group: 'Lantanoid', col: 17, row: 8, category: 'lanthanide' },

  // Actinides (Row 9, cols 4..17)
  { z: 90, symbol: 'Th', name: 'Torium', ar: 232, period: 7, group: 'Aktinoid', col: 4, row: 9, category: 'actinide' },
  { z: 91, symbol: 'Pa', name: 'Protaktinium', ar: 231, period: 7, group: 'Aktinoid', col: 5, row: 9, category: 'actinide' },
  { z: 92, symbol: 'U', name: 'Uran', ar: 238, period: 7, group: 'Aktinoid', col: 6, row: 9, category: 'actinide' },
  { z: 93, symbol: 'Np', name: 'Neptunium', ar: 237, period: 7, group: 'Aktinoid', col: 7, row: 9, category: 'actinide' },
  { z: 94, symbol: 'Pu', name: 'Plutonium', ar: 244, period: 7, group: 'Aktinoid', col: 8, row: 9, category: 'actinide' },
  { z: 95, symbol: 'Am', name: 'Amerisium', ar: 243, period: 7, group: 'Aktinoid', col: 9, row: 9, category: 'actinide' },
  { z: 96, symbol: 'Cm', name: 'Kürium', ar: 247, period: 7, group: 'Aktinoid', col: 10, row: 9, category: 'actinide' },
  { z: 97, symbol: 'Bk', name: 'Berklium', ar: 247, period: 7, group: 'Aktinoid', col: 11, row: 9, category: 'actinide' },
  { z: 98, symbol: 'Cf', name: 'Kalifornium', ar: 251, period: 7, group: 'Aktinoid', col: 12, row: 9, category: 'actinide' },
  { z: 99, symbol: 'Es', name: 'Eynşteynium', ar: 252, period: 7, group: 'Aktinoid', col: 13, row: 9, category: 'actinide' },
  { z: 100, symbol: 'Fm', name: 'Fermium', ar: 257, period: 7, group: 'Aktinoid', col: 14, row: 9, category: 'actinide' },
  { z: 101, symbol: 'Md', name: 'Mendelevium', ar: 258, period: 7, group: 'Aktinoid', col: 15, row: 9, category: 'actinide' },
  { z: 102, symbol: 'No', name: 'Nobelium', ar: 259, period: 7, group: 'Aktinoid', col: 16, row: 9, category: 'actinide' },
  { z: 103, symbol: 'Lr', name: 'Lourensium', ar: 262, period: 7, group: 'Aktinoid', col: 17, row: 9, category: 'actinide' },
].sort((a, b) => a.z - b.z);

const METAL_ACTIVITY_SERIES = [
  'Li', 'K', 'Ba', 'Ca', 'Na', 'Mg', 'Al', 'Mn', 'Zn', 'Cr', 'Fe', 'Ni', 'Sn', 'Pb', '(H₂)', 'Cu', 'Hg', 'Ag', 'Pt', 'Au',
];

export const MendeleevTableTool: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(
    ELEMENTS.find(e => e.z === 6) || ELEMENTS[0],
  );
  const [fullModalOpen, setFullModalOpen] = useState(false);

  const filteredElements = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ELEMENTS.slice(0, 36); // First 36 elements (H..Kr) by default in compact view
    return ELEMENTS.filter(
      el =>
        el.symbol.toLowerCase().includes(q) ||
        el.name.toLowerCase().includes(q) ||
        String(el.z) === q ||
        String(el.ar) === q,
    );
  }, [search]);

  const cellMap = useMemo(() => {
    const map = new Map<string, ChemicalElement>();
    for (const el of ELEMENTS) {
      map.set(`${el.row}-${el.col}`, el);
    }
    return map;
  }, []);

  return (
    <div data-exam-tools="true" className="space-y-2.5">
      {/* Search + Expand Bar */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
            placeholder="Simvol, ad və ya Z (məs: Fe, 26)"
            className="h-8 pl-8 pr-7 text-xs rounded-lg"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setFullModalOpen(true)}
          className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
          title="Tam 18 sütunlu Mendeleyev cədvəlini aç"
        >
          <Maximize2 className="w-3.5 h-3.5 mr-1" />
          Tam
        </Button>
      </div>

      {/* Selected Element Card */}
      {selectedElement && (
        <div
          className={cn(
            'p-2.5 rounded-xl border transition-all',
            CATEGORY_META[selectedElement.category].badgeClass,
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-background/90 border border-current/20 flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-[9px] font-mono leading-none opacity-75">
                  {selectedElement.z}
                </span>
                <span className="text-base font-black leading-tight">
                  {selectedElement.symbol}
                </span>
              </div>
              <div>
                <div className="font-bold text-xs leading-tight text-foreground">
                  {selectedElement.name}
                </div>
                <div className="text-[10px] opacity-85 font-medium">
                  {CATEGORY_META[selectedElement.category].label}
                </div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs font-black text-foreground">
                Ar = {selectedElement.ar}
              </div>
              <div className="text-[10px] opacity-85">
                Dövr {selectedElement.period} · {selectedElement.group}
              </div>
            </div>
          </div>
          {selectedElement.valency && (
            <div className="mt-1.5 pt-1.5 border-t border-current/15 flex items-center justify-between text-[10px]">
              <span className="opacity-80">Valentlik:</span>
              <span className="font-mono font-bold">{selectedElement.valency}</span>
            </div>
          )}
        </div>
      )}

      {/* Compact Scrollable Element Grid */}
      <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto pr-0.5">
        {filteredElements.map(el => {
          const isSelected = selectedElement?.z === el.z;
          return (
            <button
              key={el.z}
              type="button"
              onClick={() => setSelectedElement(el)}
              className={cn(
                'p-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center',
                CATEGORY_META[el.category].cellClass,
                isSelected && 'ring-2 ring-primary font-bold scale-[1.03] shadow-sm',
              )}
              title={`${el.z}. ${el.name} (Ar = ${el.ar})`}
            >
              <span className="text-[8px] font-mono leading-none opacity-75">
                {el.z}
              </span>
              <span className="text-xs font-bold leading-tight">{el.symbol}</span>
              <span className="text-[8px] font-mono leading-none opacity-80">
                {el.ar}
              </span>
            </button>
          );
        })}
      </div>

      {!search && (
        <div className="text-[10px] text-muted-foreground text-center">
          İlk 36 element göstərilir. Digərləri üçün axtarın və ya{' '}
          <button
            type="button"
            onClick={() => setFullModalOpen(true)}
            className="text-primary font-semibold underline underline-offset-2"
          >
            Tam cədvəli açın
          </button>
          .
        </div>
      )}

      {/* Full 18-Column Mendeleev Periodic Table Modal */}
      <Dialog open={fullModalOpen} onOpenChange={setFullModalOpen}>
        <DialogContent
          data-exam-tools="true"
          className="max-w-[96vw] sm:max-w-6xl max-h-[92vh] overflow-y-auto p-3 sm:p-5 rounded-2xl"
        >
          <DialogHeader className="pb-2 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-6">
              <DialogTitle className="text-base sm:text-lg font-bold">
                🧪 Kimyəvi Elementlərin Dövri Sistemi (Mendeleyev Cədvəli)
              </DialogTitle>
              {selectedElement && (
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border bg-muted/40 text-xs">
                  <span className="font-black text-primary text-sm">
                    {selectedElement.z}. {selectedElement.symbol} — {selectedElement.name}
                  </span>
                  <span className="font-mono font-bold">
                    Ar = {selectedElement.ar}
                  </span>
                  <span className="text-muted-foreground">
                    Dövr: {selectedElement.period} | Qrup: {selectedElement.group}
                  </span>
                  {selectedElement.valency && (
                    <span className="text-muted-foreground hidden md:inline">
                      | Valentlik: <strong>{selectedElement.valency}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          {/* 18-Column Grid */}
          <div className="overflow-x-auto py-2">
            <div className="min-w-[820px] space-y-1">
              {/* Column Numbers 1..18 */}
              <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 text-[9px] font-mono text-center text-muted-foreground pb-0.5">
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i + 1} className="font-semibold">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Rows 1..7 */}
              {[1, 2, 3, 4, 5, 6, 7].map(r => (
                <div key={r} className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
                  {Array.from({ length: 18 }, (_, idx) => {
                    const c = idx + 1;
                    const el = cellMap.get(`${r}-${c}`);
                    if (!el) {
                      return <div key={c} className="h-11 rounded-md" />;
                    }
                    const isSelected = selectedElement?.z === el.z;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedElement(el)}
                        className={cn(
                          'h-11 p-0.5 rounded-md border flex flex-col items-center justify-between transition-all',
                          CATEGORY_META[el.category].cellClass,
                          isSelected && 'ring-2 ring-primary scale-105 z-10 shadow-md',
                        )}
                      >
                        <div className="w-full flex justify-between px-0.5 text-[8px] font-mono leading-none opacity-80">
                          <span>{el.z}</span>
                          <span>{el.ar}</span>
                        </div>
                        <div className="text-xs font-black leading-none">
                          {el.symbol}
                        </div>
                        <div className="text-[7px] leading-none truncate max-w-full px-0.5 opacity-90">
                          {el.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Spacer */}
              <div className="h-2" />

              {/* Lanthanides & Actinides (Rows 8 & 9) */}
              {[
                { row: 8, title: '58–71 Lantanoidlər' },
                { row: 9, title: '90–103 Aktinoidlər' },
              ].map(({ row, title }) => (
                <div key={row} className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 items-center">
                  <div className="col-span-3 text-[10px] font-bold text-muted-foreground text-right pr-2">
                    {title}:
                  </div>
                  {Array.from({ length: 15 }, (_, idx) => {
                    const c = idx + 4;
                    const el = cellMap.get(`${row}-${c}`);
                    if (!el) return <div key={c} className="h-10" />;
                    const isSelected = selectedElement?.z === el.z;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedElement(el)}
                        className={cn(
                          'h-10 p-0.5 rounded-md border flex flex-col items-center justify-between transition-all',
                          CATEGORY_META[el.category].cellClass,
                          isSelected && 'ring-2 ring-primary scale-105 z-10 shadow-md',
                        )}
                      >
                        <div className="w-full flex justify-between px-0.5 text-[8px] font-mono leading-none opacity-80">
                          <span>{el.z}</span>
                          <span>{el.ar}</span>
                        </div>
                        <div className="text-xs font-black leading-none">
                          {el.symbol}
                        </div>
                        <div className="text-[7px] leading-none truncate max-w-full px-0.5 opacity-90">
                          {el.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Metal Activity Series */}
          <div className="pt-2 border-t space-y-1.5">
            <div className="text-[11px] font-bold text-muted-foreground">
              ⚡ Metalların elektrokimyəvi gərginlik sırası (Aktivlik soldan sağa azalır):
            </div>
            <div className="flex items-center gap-1 flex-wrap font-mono text-xs">
              {METAL_ACTIVITY_SERIES.map((sym, idx) => (
                <React.Fragment key={sym}>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-md border font-bold',
                      sym === '(H₂)'
                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-700 dark:text-sky-300'
                        : idx < 14
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                          : 'bg-amber-500/10 border-amber-500/30 text-foreground',
                    )}
                  >
                    {sym}
                  </span>
                  {idx < METAL_ACTIVITY_SERIES.length - 1 && (
                    <span className="text-muted-foreground text-[10px]">›</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
