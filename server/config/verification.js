import crypto from "crypto";

export const verify = (req) => {
  const secret = process.env.SECRET
  const sha256 = req.headers['x-hub-signature-256'] 
  const sha1 = req.headers['x-hub-signature']
  const payload = req.rawBody || Buffer.from(JSON.stringify(req.body));
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (sha256) { return `sha256=${hmac}` === sha256 }
  if (sha1) {
    const hmac1 = crypto.createHmac('sha1', secret).update(payload).digest('hex');
    return `sha1=${hmac1}` === sha1;
  }
  return false;
}