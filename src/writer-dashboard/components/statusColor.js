// statusColor.js

function getStatusColor(status) {
    switch (status) {
      case 'Active':
        return 'bg-yellow-500';
      case 'Processed':
        return 'bg-red-400';
      case 'Completed':
        return 'bg-green-500';
      default:
        return ''; // Default color or no color
    }
  }
  
  export default getStatusColor;
  