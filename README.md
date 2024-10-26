# Backend for Jane's Bookshop

## 📖 Summary

Backend API for new e-commerce website for Jane, where you can find books as soon as they will published

## 🛠️ Tech Stack

Used technologies:
- Typescript
- NestJS
- Prisma
- PostgresSQL
- Docker (optional)

## 📄 Instructions

### 🧪 Testing

Start PostgresSQL with docker compose or in your system

and just run

```
yarn test
```

### Deployment

💡💡💡 In near feature we are going to add Dockerfile to publish it with docker 💡💡💡

Setup env variables (copy and fill `.env.example`)

Update database: `yarn prisma migrate deploy`

Now you have to run `yarn start` to run NestJS server. Be sure, that postgres database is running

### 👨‍💻 Local development

Setup env variables (copy and fill `.env.example`)

Now you have to run `yarn start:dev` to run NestJS server in watch mode.

If you want (or have) changed prisma schema just create new migration with `yarn prisma migrate dev --name ${name-for-migration}`

## 🙂🙂🙂 Have a nice day!

