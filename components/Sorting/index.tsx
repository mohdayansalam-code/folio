import Icon from "@/components/Icon";

type SortingProps = {
    title: string;
};

const Sorting = ({ title }: SortingProps) => (
    <div className="flex items-center cursor-pointer transition-colors hover:text-purple-1">
        {title}
        <Icon className="ml-2 icon-16 fill-n-2 dark:fill-white/50" name="arrow-bottom" />
    </div>
);

export default Sorting;
