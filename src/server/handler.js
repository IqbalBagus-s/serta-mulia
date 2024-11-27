const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "explanation": explanation,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }

  // Log the data to verify what will be stored
  console.log('Data to be stored:', data);

  try {
    await storeData(id, data);
    console.log('Data successfully stored with ID:', id);
  } catch (error) {
    console.error('Error storing data:', error);
    return h.response({
      status: 'error',
      message: 'Failed to store data.',
      error: error.message
    }).code(500);
  }
  
  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;
