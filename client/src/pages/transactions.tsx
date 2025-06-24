import { useQuery } from "@tanstack/react-query";
import { FaArrowDown, FaArrowUp, FaPlus, FaFilter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { useState } from "react";
import { TransactionData } from "@/types";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: transactions = [] } = useQuery<TransactionData[]>({
    queryKey: ["/api/transactions"],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'receive':
        return { icon: FaArrowDown, color: 'bg-success/10 text-success' };
      case 'send':
        return { icon: FaArrowUp, color: 'bg-primary/10 text-primary' };
      case 'topup':
        return { icon: FaPlus, color: 'bg-accent/10 text-accent' };
      default:
        return { icon: FaArrowUp, color: 'bg-neutral-100 text-neutral-600' };
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const value = parseFloat(amount);
    const sign = type === 'receive' || type === 'topup' ? '+' : '-';
    return `${sign}$${value.toFixed(2)}`;
  };

  const getAmountColor = (type: string) => {
    return type === 'receive' || type === 'topup' ? 'text-success' : 'text-neutral-900';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTransactionDescription = (transaction: TransactionData) => {
    if (transaction.description) return transaction.description;
    
    switch (transaction.type) {
      case 'topup':
        return 'Wallet Top-up';
      case 'send':
        return 'Payment Sent';
      case 'receive':
        return 'Payment Received';
      default:
        return 'Transaction';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      getTransactionDescription(transaction).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Header */}
        <div className="py-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Transaction History</h1>
          
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <div className="flex space-x-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="topup">Top Up</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-neutral-600">
                {transactions.length === 0 ? "No transactions yet" : "No transactions match your filters"}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const { icon: Icon, color } = getTransactionIcon(transaction.type);
              
              return (
                <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {getTransactionDescription(transaction)}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </p>
                      <p className="text-xs text-neutral-600 capitalize">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      
      <BottomNavigation currentPage="transactions" />
    </div>
  );
}
