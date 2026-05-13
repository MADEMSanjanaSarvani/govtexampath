import React from 'react';
import { FiMessageCircle, FiSend, FiTwitter, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareButtons = ({ url, title, description }) => {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const buttons = [
    {
      label: 'WhatsApp',
      icon: FiMessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      bg: 'bg-[#25D366]',
      hoverBg: 'hover:bg-[#1ebe57]',
    },
    {
      label: 'Telegram',
      icon: FiSend,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      bg: 'bg-[#0088cc]',
      hoverBg: 'hover:bg-[#0077b3]',
    },
    {
      label: 'Twitter',
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bg: 'bg-[#1DA1F2]',
      hoverBg: 'hover:bg-[#0d8de0]',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {buttons.map(({ label, icon: Icon, href, bg, hoverBg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105 ${bg} ${hoverBg}`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-sm font-medium bg-gray-500 hover:bg-gray-600 transition-transform hover:scale-105"
      >
        <FiLink className="w-4 h-4" />
        <span className="hidden sm:inline">Copy Link</span>
      </button>
    </div>
  );
};

export default ShareButtons;
