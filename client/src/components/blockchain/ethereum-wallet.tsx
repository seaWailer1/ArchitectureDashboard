import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnection {
  address: string;
  chainId: number;
  balance: string;
  provider: string;
}

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (data: any) => void) => void;
  removeListener: (event: string, callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function EthereumWallet() {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await updateWalletInfo(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask to connect your Ethereum wallet.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletInfo(accounts[0]);
      
      toast({
        title: 'Wallet connected',
        description: 'Your Ethereum wallet has been successfully connected.',
      });
    } catch (error: any) {
      toast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect wallet.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWalletInfo = async (address: string) => {
    try {
      const [chainId, balance] = await Promise.all([
        window.ethereum!.request({ method: 'eth_chainId' }),
        window.ethereum!.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      ]);

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      setWallet({
        address,
        chainId: parseInt(chainId, 16),
        balance: balanceInEth.toFixed(4),
        provider: 'MetaMask'
      });
      setConnected(true);

      // Send wallet info to backend
      await fetch('/api/blockchain/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          chainId: parseInt(chainId, 16),
          provider: 'metamask'
        })
      });
    } catch (error) {
      console.error('Error updating wallet info:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      updateWalletInfo(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const disconnectWallet = () => {
    setWallet(null);
    setConnected(false);
    toast({
      title: 'Wallet disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: 'Address copied',
        description: 'Wallet address copied to clipboard.',
      });
    }
  };

  const getNetworkName = (chainId: number) => {
    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      11155111: 'Sepolia Testnet'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const refreshBalance = async () => {
    if (wallet?.address) {
      setLoading(true);
      await updateWalletInfo(wallet.address);
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Ethereum Wallet
          </CardTitle>
          <CardDescription>
            Connect your MetaMask or other Ethereum wallet to access blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectWallet} 
            disabled={loading || !window.ethereum}
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          {!window.ethereum && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              MetaMask extension not detected. 
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline ml-1"
              >
                Install MetaMask
                <ExternalLink className="h-3 w-3 inline ml-1" />
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Ethereum Wallet
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Address</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
              {wallet?.address}
            </code>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Network</label>
            <p className="text-sm text-muted-foreground mt-1">
              {wallet && getNetworkName(wallet.chainId)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Balance</label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-mono">{wallet?.balance} ETH</p>
              <Button size="sm" variant="ghost" onClick={refreshBalance} disabled={loading}>
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" onClick={disconnectWallet} className="flex-1">
            Disconnect
          </Button>
          <Button 
            onClick={() => window.open(`https://etherscan.io/address/${wallet?.address}`, '_blank')}
            variant="outline"
            className="flex-1"
          >
            View on Etherscan
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}