'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { API_BASE_URL, getApiUrl, getImageUrl } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const uploadFilesToS3 = async (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return;

    const setUploading = type === 'image' ? setUploadingImages : setUploadingVideos;
    const setUrls = type === 'image' ? setImageUrls : setVideoUrls;
    const maxCount = type === 'image' ? 10 : 5;
    const currentCount = type === 'image' ? imageUrls.length : videoUrls.length;

    if (currentCount >= maxCount) {
      showToast(`You can upload up to ${maxCount} ${type}s only`, 'error');
      return;
    }

    setUploading(true);
    try {
      const selectedFiles = Array.from(files).slice(0, maxCount - currentCount);
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const contentType = file.type || (type === 'image' ? 'image/jpeg' : 'video/mp4');
        const filename = file.name || `${type}-${Date.now()}`;

        const presignRes = await fetch(
          `${API_BASE_URL}/upload/presign?folder=contact-messages&filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`
        );
        const presignData = await presignRes.json();

        if (!presignRes.ok || !presignData.uploadUrl || !presignData.publicUrl) {
          throw new Error(presignData?.error || `Failed to prepare ${type} upload`);
        }

        const putRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': contentType },
        });

        if (!putRes.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        uploadedUrls.push(presignData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setUrls((prev) => [...prev, ...uploadedUrls]);
        showToast(`${uploadedUrls.length} ${type}${uploadedUrls.length > 1 ? 's' : ''} uploaded`, 'success');
      }
    } catch (error) {
      console.error(`Error uploading ${type}s:`, error);
      showToast(`Failed to upload ${type}s. Please try again.`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(getApiUrl('contact-messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls,
          videoUrls,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      showToast('Thank you for contacting us! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setImageUrls([]);
      setVideoUrls([]);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Have a question or need assistance? We&apos;re here to help! Reach out to us through any of the following 
            channels, and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a href="mailto:Musshk09@gmail.com" className="text-gray-700 hover:text-primary-600">
                Musshk09@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a href="tel:9759905151" className="text-gray-700 hover:text-primary-600">
                97599 05151
              </a>
              <p className="text-gray-700 mt-1">Mon - Sat: 10:00 AM - 7:00 PM IST</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-700">
                Musshk<br />
                Gurgaon, Haryana, India
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
              <p className="text-gray-700">
                Monday - Saturday: 10:00 AM - 7:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadFilesToS3(e.target.files, 'image')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={uploadingImages || submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Up to 10 images</p>
              {uploadingImages && <p className="text-sm text-gray-500 mt-2">Uploading images...</p>}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imageUrls.map((url, index) => (
                    <div key={url} className="relative">
                      <img
                        src={getImageUrl(url)}
                        alt={`Upload ${index + 1}`}
                        className="h-20 w-full object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrls((prev) => prev.filter((item) => item !== url))}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white text-xs"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Videos (optional)
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => uploadFilesToS3(e.target.files, 'video')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={uploadingVideos || submitting}
              />
              <p className="text-xs text-gray-500 mt-1">Up to 5 videos</p>
              {uploadingVideos && <p className="text-sm text-gray-500 mt-2">Uploading videos...</p>}
              {videoUrls.length > 0 && (
                <div className="space-y-2 mt-3">
                  {videoUrls.map((url) => (
                    <div key={url} className="flex items-center gap-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary-600 underline break-all"
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => setVideoUrls((prev) => prev.filter((item) => item !== url))}
                        className="text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImages || uploadingVideos}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 transition"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <ToastComponent />
    </div>
  );
}
