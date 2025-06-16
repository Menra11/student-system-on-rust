import pool from './db'

export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数（分页用）
    const queryParams = getQuery(event)
    const page = Number(queryParams.page) || 1
    const limit = Number(queryParams.limit) || 10
    const offset = (page - 1) * limit

    // 获取学生数据
    const [students] = await pool.query(`
      SELECT s.*, c.class_name 
      FROM Student s
      LEFT JOIN Class c ON s.class_id = c.class_id
      LIMIT ? OFFSET ?
    `, [limit, offset])

    // 获取总数用于分页
    const [totalRows]:any = await pool.query('SELECT COUNT(*) as count FROM Student')
    const total:number = totalRows[0].count
    return {
      student: students,
      new_pagination: {
        total: total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('获取学生数据失败：', error)
    return createError({
      statusCode: 500,
      statusMessage: '获取学生数据失败',
      data: {
        message: '无法获取学生数据，请稍后再试'
      }
    })
  }
})