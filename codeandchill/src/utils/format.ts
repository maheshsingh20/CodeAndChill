// Formatting utility functions

export const formatUtils = {
  // Date formatting
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  formatDateTime: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatRelativeTime: (date: string | Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatUtils.formatDate(d);
  },

  // Number formatting
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  },

  formatCurrency: (amount: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  },

  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // String formatting
  formatSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  formatTitle: (text: string): string => {
    return text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },

  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  },

  // Difficulty formatting
  formatDifficulty: (difficulty: string): {
    text: string;
    color: string;
    bgColor: string;
  } => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return {
          text: "Easy",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "medium":
        return {
          text: "Medium",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "hard":
        return {
          text: "Hard",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          text: difficulty,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  },

  // File size formatting
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
};