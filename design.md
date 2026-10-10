# Python Syntax Lab — Design

Інтерактивний навчальний ресурс (web, mobile-first responsive) для курсу «Основи Python для початківців», Модуль 1, РН1. Візуальна ідентичність узгоджена з візуальним гайдом курсу (СР-2). Тон: спокійний, дружній, «лабораторний».

## Colors
| Token | Value | Use |
|---|---|---|
| emerald | #0A8069 | Primary, buttons (white text 4.9:1) |
| ink | #0F3D3A | Headings, code background |
| mint | #D9F5EE | Soft surfaces, success tint |
| cloud | #F6FBFA | Page background |
| amber | #F4B63F | Accent, hints |
| slate | #4A5E5C | Secondary text |
| ok / bad | #0A7A45 / #B3261E | Feedback (always with icon + word) |

## Typography
Montserrat (UI, 400–800), JetBrains Mono (code). Self-hosted in /public/fonts. Base 17px, line-height 1.6, user can scale text (A− / A+).

## Accessibility
Feedback never relies on color only; aria-live for feedback; full keyboard operation; 44px touch targets; prefers-reduced-motion respected; lang="uk".

## Flow
Intro (instruction) → 1 Predict output → 2 Assemble program → 3 Find the bug → 4 Branching scenario → Results + completion code. Progress stored in localStorage.
