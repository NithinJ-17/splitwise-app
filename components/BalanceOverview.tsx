// components/BalanceOverview.tsx
import { FC } from 'react';

interface BalanceOverviewProps {
    totalBalance: number;
    fiatBalance: number;
    cryptoBalance: number;
}

const BalanceOverview: FC<BalanceOverviewProps> = ({ totalBalance, fiatBalance, cryptoBalance }) => {
    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold">Balance Overview</h2>
            <div className="mt-2">
                <p>Total Balance: ${totalBalance.toFixed(2)}</p>
                <p>Fiat Balance: ${fiatBalance.toFixed(2)}</p>
                <p>Crypto Balance: {cryptoBalance.toFixed(5)} BTC</p>
            </div>
        </div>
    );
};

export default BalanceOverview;
