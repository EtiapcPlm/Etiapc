// version1
// author Yxff
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/models/user'
import AccompanimentModel from '@/models/Accompaniment'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Si es administrador, devolver estadísticas generales
    if (user.role === 'administrator') {
      const [
        totalUsers,
        teachers,
        coordinators,
        admins
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'teacher' }),
        User.countDocuments({ role: 'coordinator' }),
        User.countDocuments({ role: 'administrator' })
      ])

      return NextResponse.json({
        totalUsers,
        teachers,
        coordinators,
        admins
      })
    }

    // Si es coordinador, devolver estadísticas específicas
    if (user.role === 'coordinator') {
      const [
        teachers,
        accompaniments
      ] = await Promise.all([
        User.countDocuments({ role: 'teacher' }),
        AccompanimentModel.countDocuments({ coordinador: user._id })
      ])

      return NextResponse.json({
        teachers,
        completedAccompaniments: accompaniments
      })
    }

    return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error fetching statistics' },
      { status: 500 }
    )
  }
} 