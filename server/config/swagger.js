import swaggerJsdoc from 'swagger-jsdoc'

export default swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Portfolio API', version: '1.0.0', description: 'API REST du portfolio de Pierre' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
  },
  apis: ['./routes/*.js'],
})