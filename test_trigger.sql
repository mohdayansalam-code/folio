SELECT w.name, w.plan, wm.role, m.email FROM workspaces w JOIN workspace_members wm ON w.id = wm.workspace_id JOIN auth.users m ON wm.user_id = m.id;
