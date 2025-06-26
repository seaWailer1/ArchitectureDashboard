import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { t } from "@/lib/i18n";
import { TransactionData } from "@/types";

export default function RecentTransactions() {
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
        return { icon: FaPlus, color: 'bg-accent/10 text-accent' };
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
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `${t('today')}, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffInDays === 1) {
      return `${t('yesterday')}, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getTransactionDescription = (transaction: TransactionData) => {
    if (transaction.description) return transaction.description;
    
    switch (transaction.type) {
      case 'topup':
        return t('walletTopUp');
      case 'send':
        return 'Payment Sent';
      case 'receive':
        return 'Payment Received';
      default:
        return 'Transaction';
    }
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">{t('recentTransactions')}</h2>
        <Link href="/transactions">
          <Button variant="ghost" className="text-primary text-sm font-medium p-0 h-auto">
            {t('viewAll')}
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-neutral-600">No transactions yet</p>
          </div>
        ) : (
          transactions.slice(0, 3).map((transaction) => {
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
    </section>
  );
}
