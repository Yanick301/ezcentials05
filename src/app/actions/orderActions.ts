'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createOrderInput = z.object({
  user_id: z.string().uuid(),
  shipping_info: z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
  items: z.array(z.any()),
  subtotal: z.number(),
  shipping: z.number(),
  taxes: z.number(),
  total_amount: z.number(),
})

export async function createOrder(input: z.infer<typeof createOrderInput>) {
  try {
    const supabase = await createClient()
    const validatedInput = createOrderInput.parse(input)

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: validatedInput.user_id,
        shipping_info: validatedInput.shipping_info,
        items: validatedInput.items,
        subtotal: validatedInput.subtotal,
        shipping: validatedInput.shipping,
        taxes: validatedInput.taxes,
        total_amount: validatedInput.total_amount,
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return { success: false, error: error.message, orderId: null }
    }

    return { success: true, error: null, orderId: data.id }
  } catch (error: any) {
    console.error('Error in createOrder:', error)
    return { success: false, error: error.message || 'Failed to create order', orderId: null }
  }
}

const updateOrderStatusInput = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'completed', 'rejected']),
  receiptImageUrl: z.string().optional().nullable(),
})

export async function updateOrderStatus(input: z.infer<typeof updateOrderStatusInput>) {
  try {
    const supabase = await createClient()
    const validatedInput = updateOrderStatusInput.parse(input)

    const updateData: any = {
      payment_status: validatedInput.status,
    }

    if (validatedInput.receiptImageUrl !== undefined) {
      updateData.receipt_image_url = validatedInput.receiptImageUrl
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', validatedInput.orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error in updateOrderStatus:', error)
    return { success: false, error: error.message || 'Failed to update order status' }
  }
}























