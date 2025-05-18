# System Patterns

## Kiến trúc hệ thống
- Next.js App Router cho routing và server-side rendering
- React cho UI components
- TypeScript cho type safety
- Tailwind CSS cho styling
- shadcn/ui cho UI components
- Vercel AI SDK cho tích hợp AI

## Các mẫu thiết kế
1. Provider Pattern
   - ThemeProvider cho dark/light mode
   - SidebarProvider cho quản lý trạng thái sidebar
   - ChatProvider cho quản lý trạng thái chat

2. Component Pattern
   - Atomic Design cho UI components
   - Container/Presenter Pattern cho logic và UI separation

3. API Pattern
   - RESTful API endpoints cho chat
   - Environment variables cho configuration
   - API key management system

## Cấu trúc thư mục
```
project-root/
├── app/                  # Next.js App Router
├── components/           # React components
├── config/              # Configuration files
├── lib/                 # Utility functions
└── public/              # Static files
```

## Quyết định kỹ thuật
1. Next.js App Router cho routing và SSR
2. TypeScript cho type safety
3. Tailwind CSS cho styling
4. shadcn/ui cho UI components
5. Vercel AI SDK cho AI integration
6. Docker cho deployment 