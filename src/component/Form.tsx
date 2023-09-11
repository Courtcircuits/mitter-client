import "./Form.css"

interface PropsForm{
    title: string;
    children: React.ReactNode;
}

export default function Form(props: PropsForm){
    return (
        <div className="form">
            <h2>{props.title}</h2>
            {
                props.children
            }
        </div>
    )
}