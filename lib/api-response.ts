import { NextResponse } from 'next/server'
import { z } from 'zod'

// Standard API Response
export function apiSuccess<T>(data: T, message = 'Success', statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  )
}

// API Error Response
export function apiError(message: string, statusCode = 400, errors?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: statusCode }
  )
}

// Pagination Response
export function apiPagination<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// Zod Error Handler
export function handleZodError(error: z.ZodError) {
  const errors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  return apiError('Validation error', 400, errors)
}

// Generic Error Handler
export function handleError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof z.ZodError) {
    return handleZodError(error)
  }
  
  if (error instanceof Error) {
    return apiError(error.message, 500)
  }
  
  return apiError('Internal server error', 500)
}
