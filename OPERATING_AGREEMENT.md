# ERPv3 Operating Agreement

## Repository Workflow Policy

This document establishes the mandatory workflow for all development work on ERPv3.

### Branch Protection Rules

**Main Branch (`main`):**
- ✅ **Protected** - No direct pushes allowed
- ✅ **PR Required** - All changes must go through Pull Requests
- ✅ **Review Required** - At least 1 approving review needed
- ✅ **Status Checks** - Vercel deployment must pass
- ✅ **Linear History** - No merge commits allowed
- ✅ **No Force Push** - History cannot be rewritten
- ✅ **No Deletion** - Branch cannot be deleted

**Staging Branches (`staging/*`):**
- ✅ **Push Allowed** - Direct pushes permitted for development
- ✅ **No Force Push** - History protection enabled
- ✅ **No Deletion** - Protected from accidental removal

### Development Workflow

#### For Manus AI Agent:
1. **NEVER** push directly to `main` branch
2. **NEVER** merge PRs to `main` branch  
3. **NEVER** force push to any branch
4. **ALWAYS** work on `staging/<scope>-<description>` branches
5. **ALWAYS** create PRs for all changes to `main`
6. **ALWAYS** use the provided PR template
7. **ALWAYS** delete merged staging branches after PR completion

#### For Human Reviewers:
1. **Review** all PRs before merging
2. **Approve** PRs only after verification
3. **Merge** PRs using squash or rebase (no merge commits)
4. **Monitor** Vercel deployments for issues

### Deployment Pipeline

```
staging/* → PR → main (protected) → Vercel Production
```

- **Preview Deployments:** Automatic for all `staging/*` branches
- **Production Deployments:** Automatic only from `main` branch after PR merge
- **Status Checks:** Vercel build must pass before PR can be merged

### Branch Naming Convention

Use descriptive branch names following this pattern:
```
staging/<scope>-<short-description>
```

Examples:
- `staging/auth-login-system`
- `staging/inventory-crud-operations`
- `staging/reports-dashboard-ui`
- `staging/bugfix-cart-calculation`

### Commit Message Convention

Use conventional commit format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Emergency Procedures

In case of critical production issues:
1. Create hotfix branch: `staging/hotfix-<issue>`
2. Implement minimal fix
3. Create emergency PR with detailed explanation
4. Request immediate review and approval
5. Monitor deployment closely

### Rollback Procedures

If a deployment causes issues:
1. **DO NOT** force push or revert commits
2. Create new PR with revert changes
3. Follow normal review process
4. Document incident and lessons learned

---

**This agreement is binding for all contributors and automated systems working on ERPv3.**

*Last updated: August 13, 2025*

