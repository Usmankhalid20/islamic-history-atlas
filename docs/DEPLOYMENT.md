# Deployment Plan

## Status

Deployment provider has not been selected. Do not assume that a free tier is suitable for permanent public or commercial use.

## Environments

- Local: developer machine and local database.
- Preview: temporary review deployment for a branch or pull request, if supported by the selected host.
- Production: public application and production database.

## Deployment checklist

1. Select a host after checking current pricing, usage limits, commercial terms, and regional availability.
2. Provision PostgreSQL.
3. Configure environment variables in the host dashboard.
4. Run database migrations using a controlled deployment process.
5. Seed only reviewed public historical data.
6. Configure domain and HTTPS.
7. Verify map tiles/data attribution requirements.
8. Test core user journeys on the deployed site.
9. Configure backups and a recovery procedure.
10. Document rollback steps.

## Environment variables

Keep a `.env.example` with variable names and safe placeholders only. Actual values belong in local `.env` or the hosting provider's secret manager.

Potential variables (names are provisional):
- `DATABASE_URL`
- `DIRECT_URL` (only if required by the selected database/ORM setup)
- Authentication provider keys, only if authentication is added

Never commit actual credentials.

## Free-tier warning

Free plans change and may impose limits, pause inactive databases, restrict commercial use, or charge for bandwidth/storage. Re-check official provider terms immediately before choosing a production setup.
