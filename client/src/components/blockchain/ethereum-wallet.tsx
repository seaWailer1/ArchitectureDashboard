import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FaWallet, FaExternalLinkAlt, FaCopy, FaSync } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

interface FaWalletConnection {
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

export function EthereumFaWallet() {
  const [connected, setConnected] = useState(false);
  const [wallet, setFaWallet] = useState<FaWalletConnection | null>(null);
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
        await updateFaWalletInfo(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectFaWallet = async () => {
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
      await updateFaWalletInfo(accounts[0]);
      
      toast({
        title: 'FaWallet connected',
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

  const updateFaWalletInfo = async (address: string) => {
    try {
      const [chainId, balance] = await Promise.all([
        window.ethereum!.request({ method: 'eth_chainId' }),
        window.ethereum!.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      ]);

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      setFaWallet({
        address,
        chainId: parseInt(chainId, 16),
        balance: balanceInEth.toFixed(4),
        provider: 'MetaMask'
      });
      setConnected(true);

      // FaPaperPlane wallet info to backend
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
      disconnectFaWallet();
    } else {
      updateFaWalletInfo(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const disconnectFaWallet = () => {
    setFaWallet(null);
    setConnected(false);
    toast({
      title: 'FaWallet disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: 'Address copied',
        description: 'FaWallet address copied to clipboard.',
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
      await updateFaWalletInfo(wallet.address);
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaWallet className="h-5 w-5" />
            Connect Ethereum FaWallet
          </CardTitle>
          <CardDescription>
            Connect your MetaMask or other Ethereum wallet to access blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectFaWallet} 
            disabled={loading || !window.ethereum}
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Connect FaWallet'}
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
                <FaExternalLinkAlt className="h-3 w-3 inline ml-1" />
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
            <FaWallet className="h-5 w-5" />
            Ethereum FaWallet
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
              <FaCopy className="h-4 w-4" />
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
                <FaSync className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" onClick={disconnectFaWallet} className="flex-1">
            Disconnect
          </Button>
          <Button 
            onClick={() => window.open(`https://etherscan.io/address/${wallet?.address}`, '_blank')}
            variant="outline"
            className="flex-1"
          >
            View on Etherscan
            <FaExternalLinkAlt className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}