interface StatBoxProps {
  Icon: React.ComponentType<any>;
  label: string;
  value: number | string;
}

const StatBox = ({ Icon, label, value }: StatBoxProps) => {
     return (
        <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
            <div className="flex justify-center mb-2">
            <Icon className="text-3xl" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-indigo-100">{label}</p>
        </div>
  );
};


export default StatBox;
