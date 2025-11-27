# Cloud Deployment Guide - Consultant Tracker

## Your Cloud Deployment Configuration

**Cloud Server IP**: `74.179.199.249`

### Quick Setup for Your IP

**Backend Environment Variables:**
```bash
# If backend is on port 8000
CORS_ORIGINS="http://74.179.199.249:3000,http://74.179.199.249"
# Or if you have a domain pointing to this IP:
# CORS_ORIGINS="http://yourdomain.com,https://yourdomain.com"

MONGODB_URL="mongodb://localhost:27017/consultant_tracker"
# Or if using MongoDB Atlas:
# MONGODB_URL="mongodb+srv://username:password@cluster.mongodb.net/consultant_tracker"
```

**Frontend Environment Variable:**
```bash
# If backend is on port 8000
REACT_APP_API_URL="http://74.179.199.249:8000/api"
# Or if using HTTPS:
# REACT_APP_API_URL="https://74.179.199.249:8000/api"
```

**Note**: Replace with your actual domain name if you have one pointing to this IP. Using IP addresses directly works but is not recommended for production.

## Environment Variables Required for Cloud Deployment

### Backend Environment Variables

1. **MONGODB_URL** (Required)
   - **Local/Development**: `mongodb://localhost:27017/consultant_tracker`
   - **Cloud (MongoDB Atlas)**: `mongodb+srv://username:password@cluster.mongodb.net/consultant_tracker?retryWrites=true&w=majority`
   - **Cloud (Other providers)**: Use your provider's connection string

2. **CORS_ORIGINS** (Required for production)
   - **Local/Development**: `http://localhost:3000,http://frontend:3000` (default)
   - **Cloud**: Set to your frontend domain(s), comma-separated
   - **Example**: `CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"`

### Frontend Environment Variables

1. **REACT_APP_API_URL** (Required for production)
   - **Local/Development**: `http://localhost:8000/api` (default)
   - **Cloud**: Set to your backend API URL
   - **Example**: `REACT_APP_API_URL="https://api.yourdomain.com/api"`

## Deployment Checklist

### Backend Deployment

- [ ] Set `MONGODB_URL` environment variable to your cloud MongoDB connection string
- [ ] Set `CORS_ORIGINS` environment variable to your frontend domain(s)
- [ ] Ensure MongoDB is accessible from your cloud provider (whitelist IPs if needed)
- [ ] Configure your cloud provider to run: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- [ ] Remove `--reload` flag in production (only for development)

### Frontend Deployment

- [ ] Set `REACT_APP_API_URL` environment variable to your backend API URL
- [ ] Build the frontend: `npm run build`
- [ ] Deploy the `build` folder to your hosting provider (Vercel, Netlify, AWS S3, etc.)
- [ ] Note: The `proxy` setting in `package.json` is only for development and can be ignored in production

## Platform-Specific Examples

### Backend on Heroku

```bash
heroku config:set MONGODB_URL="mongodb+srv://..."
heroku config:set CORS_ORIGINS="https://yourdomain.com"
```

### Backend on AWS/Google Cloud/Azure

Set environment variables in your platform's configuration:
- `MONGODB_URL`: Your MongoDB connection string
- `CORS_ORIGINS`: Your frontend domain(s)

### Frontend on Vercel

1. In Vercel dashboard, go to Project Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
3. Redeploy

### Frontend on Netlify

1. In Netlify dashboard, go to Site Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
3. Redeploy

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use HTTPS** in production (both frontend and backend)
   - **Important**: If using IP address directly, consider setting up a domain name and SSL certificate
   - IP-based access may have limitations with modern browsers and security policies
3. **MongoDB**: Use connection strings with authentication, not open databases
4. **CORS**: Only allow your actual frontend domains/IPs, not `*`
5. **Environment Variables**: Store securely in your cloud provider's secret management
6. **Firewall**: Ensure only necessary ports are open (8000 for backend, 3000 for frontend if on same server)
7. **IP Whitelisting**: If using MongoDB Atlas, add `74.179.199.249` to the IP whitelist

## Testing After Deployment

1. Check backend health: 
   - `http://74.179.199.249:8000/health` (or your domain)
2. Check API docs: 
   - `http://74.179.199.249:8000/docs` (or your domain)
3. Verify frontend can connect to backend
4. Test authentication flow
5. Verify CORS is working (check browser console for errors)

### Testing Your Specific Deployment

```bash
# Test backend health endpoint
curl http://74.179.199.249:8000/health

# Test API root
curl http://74.179.199.249:8000/

# Test API docs (open in browser)
# http://74.179.199.249:8000/docs
```

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` includes your exact frontend URL (with https://)
- Check that credentials are being sent correctly
- Ensure backend is accessible from frontend domain

### MongoDB Connection Issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas (if using)
- Ensure network security groups allow MongoDB port (27017 or 27017-27019)

### Frontend API Errors
- Verify `REACT_APP_API_URL` is set correctly
- Rebuild frontend after changing environment variables
- Check browser console for exact error messages

