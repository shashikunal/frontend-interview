import crypto from 'crypto';

/**
 * Server-side Cloudinary API Handler
 * Encapsulates secure profile avatar uploads, signature generation, and asset deletion.
 * Ensures CLOUDINARY_API_SECRET is NEVER exposed to client/browser.
 */
export default async function cloudinaryHandler(req, res) {
  if (!res.status) {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  const action = req.query?.action || req.body?.action || 'sign';

  if (req.method === 'GET' && action === 'config') {
    return res.status(200).json({
      configured: Boolean(cloudName && apiKey && apiSecret),
      cloudName: cloudName || null,
      apiKey: apiKey ? '***configured***' : null,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', allowedMethods: ['POST', 'GET'] });
  }

  // Check server configuration
  if (!cloudName || !apiKey || !apiSecret) {
    // If Cloudinary environment variables are not configured in dev mode, return fallback warning
    return res.status(503).json({
      success: false,
      error: 'Cloudinary credentials not configured on server.',
      message: 'Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server environment.',
      configured: false,
    });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = req.body?.folder || 'user_avatars';

    if (action === 'sign') {
      // Generate signed upload parameters for secure direct browser upload
      const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

      return res.status(200).json({
        success: true,
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      });
    }

    if (action === 'upload') {
      const { file, fileType, fileSize } = req.body || {};

      if (!file) {
        return res.status(400).json({ success: false, error: 'Missing image file payload.' });
      }

      // 1. File Size Validation (Max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (fileSize && fileSize > MAX_SIZE) {
        return res.status(400).json({ success: false, error: 'File size exceeds maximum limit of 5MB.' });
      }

      // 2. MIME / Type Validation
      if (fileType) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(fileType.toLowerCase())) {
          return res.status(400).json({ success: false, error: 'Invalid file type. Supported formats: JPEG, PNG, WebP.' });
        }
      }

      // Calculate SHA1 signature for server-side upload to Cloudinary API
      const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

      const formData = new URLSearchParams();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const result = await cloudinaryRes.json();

      if (!cloudinaryRes.ok || result.error) {
        return res.status(400).json({
          success: false,
          error: result.error?.message || 'Cloudinary upload failed.',
        });
      }

      // Generate avatar transformation URL (250x250 face crop)
      const publicId = result.public_id;
      const transformedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_250,h_250,q_auto,f_auto/${publicId}`;

      return res.status(200).json({
        success: true,
        avatar_url: transformedUrl,
        raw_url: result.secure_url,
        avatar_public_id: publicId,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });
    }

    if (action === 'delete') {
      const { public_id } = req.body || {};
      if (!public_id) {
        return res.status(400).json({ success: false, error: 'Missing public_id parameter for deletion.' });
      }

      const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

      const formData = new URLSearchParams();
      formData.append('public_id', public_id);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const result = await cloudinaryRes.json();
      return res.status(200).json({
        success: true,
        result: result.result || 'ok',
        deleted_public_id: public_id,
      });
    }

    return res.status(400).json({ success: false, error: `Invalid action: ${action}` });
  } catch (err) {
    console.error('[Cloudinary Handler Error]', err);
    return res.status(500).json({ success: false, error: err?.message || 'Internal Cloudinary server error.' });
  }
}
