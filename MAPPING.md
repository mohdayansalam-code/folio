# Folio UI Component Mapping

This document maps the Folio SaaS requirements to the existing components and layouts from the Bruddle Neo Brutalism UI Kit.

## Core Rules
- **No new visual styles**: All components must use existing Tailwind classes and Bruddle design tokens.
- **Reuse existing layouts**: Sidebar, Header, and Page structures are preserved.
- **Consistent Tokens**: Using `btn-purple`, `btn-stroke`, `card`, `shadow-primary-4`, etc.

## Page Mapping

| Folio Page | Bruddle Source Template | Key Components Reused |
| :--- | :--- | :--- |
| **Auth: Login** | `RegistrationPage/SignIn` | `Field`, `Checkbox`, `Icon`, `btn-purple` |
| **Auth: Signup** | `RegistrationPage/SignUp` | `Field`, `Checkbox`, `Icon`, `btn-purple` |
| **Dashboard: Overview** | `Dashboard/CrmPage` | `CardChart`, `Header`, `Sidebar`, `Layout` |
| **CRM: Clients** | `CRM/CustomersV1Page` | `Table-custom`, `Row`, `Item`, `Filters` |
| **Kanban: Content Pipeline** | `ProjectManagement/KanbanDescPage` | `TaskCard`, `Actions`, `Sorting` |
| **Calendar: Content Calendar** | `ProjectManagement/CalendarPage` | `Calendar`, `Modal`, `Header` |
| **File Manager: Client Assets** | `ProjectManagement/FileManagerFilesPage` | `File`, `Folder`, `Modal` (for upload) |
| **Forms: Client Intake** | `Profile/SettingsPage` | `Field`, `Select`, `btn-purple` |
| **Tables: Post Tracking** | `CRM/CustomersV2Page` | `Table-custom`, `Row`, `Status labels` |
| **Settings: Workspace & AI** | `Profile/SettingsPage` | `Tabs`, `Field`, `Switch`, `btn-purple` |

## New Pages (Using Existing Components)

| New Page | Components Reused | Layout Strategy |
| :--- | :--- | :--- |
| **Client Brain** | `Modal` (Upload), `Card` (Voice/Stories), `Progress` (Status) | Grid of cards with `shadow-primary-4` |
| **Weekly Content Pack** | `Select` (Client), `TaskCard` (Drafts), `btn-purple` | Header with selector + Kanban-style cards |
| **Performance (Light)** | `CardChart`, `Table-custom`, `Field` (Manual input) | Analytics dashboard layout |
| **Client Switcher** | `Select` (Small version), `Sidebar` | Integrated into the top of the `Sidebar` |

## Component Reuse Details

- **Buttons**: Use `.btn-purple`, `.btn-stroke`, `.btn-shadow`.
- **Cards**: Use `.card`, `.card-head`, `.card-title` with `.shadow-primary-4`.
- **Inputs**: Use `Field` component for text, email, password.
- **Dropdowns**: Use `Select` component for client switching and category selection.
- **Status Labels**: Use `.label-stroke-purple`, `.label-stroke-green`, etc., from `tailwind.config.js`.
- **Shadows**: Use `.shadow-primary-4` for standard cards and `.shadow-primary-6` for active elements.
