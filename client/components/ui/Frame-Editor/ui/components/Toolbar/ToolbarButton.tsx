interface IToolbarButtonProps {
    label: string
    onClick: Function
}

export const ToolbarButton = (props: IToolbarButtonProps) => {
    const { label, onClick } = props

    return (
        <button
            className="box-border cursor-pointer appearance-none rounded-md border  border-primary bg-transparent px-10 py-2 text-center text-sm font-normal text-primary no-underline transition-all duration-300 ease-in-out hover:text-white hover:shadow-toolbar_button hover:outline-0 "
            onClick={() => onClick()}
        >
            {label}
        </button>
    )
}
