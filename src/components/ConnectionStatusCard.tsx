import { RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { AccountConnection } from '../types/account';
import { CONNECTION_STATUS_COLORS, INSTITUTION_INFO } from '../types/account';

interface ConnectionStatusCardProps {
  connection: AccountConnection;
  accountCount: number;
  onSync: () => void;
  onDisconnect: () => void;
}

export function ConnectionStatusCard({
  connection,
  accountCount,
  onSync,
  onDisconnect,
}: ConnectionStatusCardProps) {
  const institutionInfo = INSTITUTION_INFO[connection.institutionId];
  const statusColor = CONNECTION_STATUS_COLORS[connection.status];

  const getStatusIcon = () => {
    switch (connection.status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'reauth_required':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTimeSinceSync = () => {
    const lastSync = new Date(connection.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-5 hover:border-gray-600/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{institutionInfo?.logo || '🏦'}</div>
          <div>
            <h3 className="text-white font-semibold">{connection.institutionName}</h3>
            <p className="text-sm text-gray-400">
              {accountCount} account{accountCount !== 1 ? 's' : ''} linked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${statusColor}`}>
          {connection.status === 'connected' && 'Connected'}
          {connection.status === 'error' && 'Connection Error'}
          {connection.status === 'reauth_required' && 'Re-authentication Required'}
          {connection.status === 'disconnected' && 'Disconnected'}
        </span>
      </div>

      {/* Error Message */}
      {connection.errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{connection.errorMessage}</p>
        </div>
      )}

      {/* Sync Info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Last synced</span>
          <div className="flex items-center gap-1.5 text-white">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTimeSinceSync()}</span>
          </div>
        </div>

        {connection.nextSync && connection.status === 'connected' && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Next sync</span>
            <span className="text-white">
              {new Date(connection.nextSync).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-700/50">
        {connection.status !== 'disconnected' && (
          <button
            onClick={onSync}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </button>
        )}

        <button
          onClick={onDisconnect}
          className="flex-1 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
        >
          {connection.status === 'disconnected' ? 'Remove' : 'Disconnect'}
        </button>
      </div>
    </div>
  );
}
