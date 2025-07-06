import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Filter } from "lucide-react";
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
        return { icon: ArrowDown, color: 'bg-success/10 text-success' };
      case 'send':
        return { icon: ArrowUp, color: 'bg-primary/10 text-primary' };
      case 'topup':
        return { icon: Plus, color: 'bg-accent/10 text-accent' };
      default:
        return { icon: ArrowUp, color: 'bg-neutral-100 text-neutral-600' };
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AppHeader />
      
      <main className="container-content mobile-padding-responsive pb-24">
        {/* Header */}
        <div className="py-4 sm:py-6">
          <h1 className="mobile-heading-responsive text-foreground mb-4 sm:mb-6">Transaction History</h1>
          
          {/* Filters */}
          <div className="mobile-spacing-responsive mb-4 sm:mb-6">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[44px] text-base"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-1 min-h-[44px]">
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
                <SelectTrigger className="flex-1 min-h-[44px]">
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
        <div className="space-y-2 sm:space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm text-center">
              <p className="text-muted-foreground mobile-text-responsive">
                {transactions.length === 0 ? "No transactions yet" : "No transactions match your filters"}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const { icon: Icon, color } = getTransactionIcon(transaction.type);
              
              return (
                <div key={transaction.id} className="bg-white dark:bg-neutral-800 rounded-xl p-3 sm:p-4 shadow-sm min-h-[72px] touch-aaa">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${color} flex-shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground mobile-text-responsive truncate">
                          {getTransactionDescription(transaction)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className={`font-semibold text-sm sm:text-base ${getAmountColor(transaction.type)}`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
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
