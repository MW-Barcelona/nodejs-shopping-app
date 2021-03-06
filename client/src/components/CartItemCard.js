import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadUser } from '../actions/authActions'
import { removeFromCart } from '../actions/cartActions'


class CartItemCard extends Component {
    componentDidMount() {
        this.props.loadUser();
    }

    removeFromCart = () => {
        let cartItem = document.getElementById('cartItem');
        cartItem.parentNode.removeChild(cartItem);     

        this.props.removeFromCart(this.props.id);
    }

    render() {
        return (
            <div className="itemCard" id="cartItem">
                <img src={ require(`../assets/${ this.props.imgUrl }`) } alt="anime" className="item-image" />
                <div className="bottomCard">
                    <h4 className="ellipsis">{ this.props.name }</h4>
                    <button className="btn" id="removeBtn" onClick={ this.removeFromCart }>
                        Remove from Cart
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    auth: state.auth
})

export default connect(mapStateToProps, { removeFromCart, loadUser })(CartItemCard);