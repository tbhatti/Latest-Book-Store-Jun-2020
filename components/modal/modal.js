import React from 'react';
export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
  }
  componentDidMount() {
    const { handleModalCloseClick, handleConfirmClick } = this.props;
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
  }
  handleCloseClick() {
    const { handleModalCloseClick } = this.props;
    $(this.modal).modal('hide');
    handleModalCloseClick();
  }

  handleConfirmClick() {
    const { handleConfirmClick } = this.props;
    $(this.modal).modal('hide');
    handleConfirmClick();
  }
  render() {
    return (
      <div>
        <div className="modal fade" ref={modal => this.modal = modal} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header card-header bg-dark text-light">
                <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to remove item from cart?
        </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.handleCloseClick}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.handleConfirmClick}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
