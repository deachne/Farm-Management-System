#!/usr/bin/env node

/**
 * BizzyPerson Environment Setup Script
 * 
 * This script sets up the environment variables for both AnythingLLM and LibreChat
 * based on the main BizzyPerson .env file.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found in the project root directory.');
  console.error('Please create a .env file based on the .env.example template.');
  process.exit(1);
}

// Parse the .env file
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Paths to the AnythingLLM and LibreChat directories
const anythingLLMPath = path.resolve(__dirname, '../core/anythingllm');
const libreChatPath = path.resolve(__dirname, '../core/librechat');

// Check if the directories exist
if (!fs.existsSync(anythingLLMPath)) {
  console.error('Error: AnythingLLM directory not found.');
  console.error('Please make sure the AnythingLLM repository is cloned to the correct location.');
  process.exit(1);
}

if (!fs.existsSync(libreChatPath)) {
  console.error('Error: LibreChat directory not found.');
  console.error('Please make sure the LibreChat repository is cloned to the correct location.');
  process.exit(1);
}

// Create AnythingLLM .env file
function setupAnythingLLMEnv() {
  console.log('Setting up AnythingLLM environment variables...');
  
  const anythingLLMEnvPath = path.resolve(anythingLLMPath, 'server/.env');
  
  // Map BizzyPerson env vars to AnythingLLM env vars
  const anythingLLMEnv = [
    `SERVER_PORT=${envConfig.ANYTHINGLLM_SERVER_PORT || 3001}`,
    `JWT_SECRET=${envConfig.ANYTHINGLLM_JWT_SECRET || 'change-this-random-string-for-seeding'}`,
    `SIG_KEY=${envConfig.ANYTHINGLLM_SIG_KEY || 'change-this-random-string-at-least-32-chars'}`,
    `SIG_SALT=${envConfig.ANYTHINGLLM_SIG_SALT || 'change-this-random-string-at-least-32-chars'}`,
    '',
    '# LLM Provider Configuration',
    `LLM_PROVIDER=${envConfig.ANYTHINGLLM_LLM_PROVIDER || 'openai'}`,
    `OPEN_AI_KEY=${envConfig.ANYTHINGLLM_OPEN_AI_KEY || envConfig.OPENAI_API_KEY || 'your-openai-api-key'}`,
    `OPEN_MODEL_PREF=${envConfig.ANYTHINGLLM_OPEN_MODEL_PREF || 'gpt-4o'}`,
    '',
    '# Embedding Configuration',
    `EMBEDDING_ENGINE=${envConfig.ANYTHINGLLM_EMBEDDING_ENGINE || 'openai'}`,
    `EMBEDDING_MODEL_PREF=${envConfig.ANYTHINGLLM_EMBEDDING_MODEL_PREF || 'text-embedding-3-small'}`,
    `EMBEDDING_BATCH_SIZE=${envConfig.ANYTHINGLLM_EMBEDDING_BATCH_SIZE || 512}`,
    '',
    '# Vector Database Configuration',
    `VECTOR_DB=${envConfig.ANYTHINGLLM_VECTOR_DB || 'lancedb'}`,
    `STORAGE_DIR=${envConfig.ANYTHINGLLM_STORAGE_DIR || './storage'}`,
  ].join('\n');
  
  fs.writeFileSync(anythingLLMEnvPath, anythingLLMEnv);
  console.log(`AnythingLLM .env file created at ${anythingLLMEnvPath}`);
}

// Create LibreChat .env file
function setupLibreChatEnv() {
  console.log('Setting up LibreChat environment variables...');
  
  const libreChatEnvPath = path.resolve(libreChatPath, '.env');
  
  // Map BizzyPerson env vars to LibreChat env vars
  const libreChatEnv = [
    '#=====================================================================#',
    '#                       LibreChat Configuration                       #',
    '#=====================================================================#',
    '',
    '#==================================================#',
    '#               Server Configuration               #',
    '#==================================================#',
    '',
    `HOST=${envConfig.LIBRECHAT_HOST || 'localhost'}`,
    `PORT=${envConfig.LIBRECHAT_PORT || 3080}`,
    '',
    `MONGO_URI=${envConfig.LIBRECHAT_MONGO_URI || 'mongodb://127.0.0.1:27017/LibreChat'}`,
    '',
    `DOMAIN_CLIENT=${envConfig.LIBRECHAT_DOMAIN_CLIENT || 'http://localhost:3080'}`,
    `DOMAIN_SERVER=${envConfig.LIBRECHAT_DOMAIN_SERVER || 'http://localhost:3080'}`,
    '',
    'NO_INDEX=true',
    'TRUST_PROXY=1',
    '',
    '#===============#',
    '# Debug Logging #',
    '#===============#',
    '',
    `DEBUG_LOGGING=${envConfig.LIBRECHAT_DEBUG_LOGGING || 'true'}`,
    `DEBUG_CONSOLE=${envConfig.LIBRECHAT_DEBUG_CONSOLE || 'false'}`,
    '',
    '#===================================================#',
    '#                     Endpoints                     #',
    '#===================================================#',
    '',
    `ENDPOINTS=${envConfig.LIBRECHAT_ENDPOINTS || 'openAI,assistants,azureOpenAI,google,gptPlugins,anthropic'}`,
    '',
    '#============#',
    '# OpenAI API #',
    '#============#',
    '',
    `OPENAI_API_KEY=${envConfig.OPENAI_API_KEY || 'user_provided'}`,
    '',
    '#============#',
    '# Anthropic  #',
    '#============#',
    '',
    `ANTHROPIC_API_KEY=${envConfig.ANTHROPIC_API_KEY || 'user_provided'}`,
    '',
    '#==================================================#',
    '#                  Authentication                   #',
    '#==================================================#',
    '',
    `JWT_SECRET=${envConfig.LIBRECHAT_JWT_SECRET || 'your-librechat-jwt-secret-change-this'}`,
    `JWT_REFRESH_SECRET=${envConfig.LIBRECHAT_JWT_REFRESH_SECRET || 'your-librechat-refresh-secret-change-this'}`,
  ].join('\n');
  
  fs.writeFileSync(libreChatEnvPath, libreChatEnv);
  console.log(`LibreChat .env file created at ${libreChatEnvPath}`);
}

// Main function
function main() {
  try {
    // Install required dependencies
    console.log('Installing required dependencies...');
    execSync('npm install dotenv', { cwd: __dirname, stdio: 'inherit' });
    
    // Setup environment variables for both systems
    setupAnythingLLMEnv();
    setupLibreChatEnv();
    
    console.log('\nEnvironment variables setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the generated .env files in each system directory');
    console.log('2. Start the development environment with Docker Compose');
    console.log('3. Access AnythingLLM at http://localhost:3001');
    console.log('4. Access LibreChat at http://localhost:3080');
  } catch (error) {
    console.error('Error setting up environment variables:', error.message);
    process.exit(1);
  }
}

// Run the main function
main(); 