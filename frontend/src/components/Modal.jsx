import "./Modal.css"

export default function Modal( { isOpen, onClose, title, children } ) {

    if (!isOpen) {
        return null;
    }

    return(
    // clicking the background closes the Modal
    <div className="modal-backdrop" onClick={onClose}>  
        
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>

            <div className="header">
                <h3>{title}</h3>
            </div>

            <div className="modal-body">
                {children}
            </div>
        </div>

    </div>
    );
}