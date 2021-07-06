export default class BaseScreen extends Component {
    constructor(props) {
      super(props)
  
      const { height, width } = Dimensions.get('screen')
  
      // use this to avoid setState errors on unmount
      this._isMounted = false
  
      this.state = {
        screen: {
          orientation: width < height,
          height: height,
          width: width
        }
      }
    }
  
    componentDidMount() {
      this._isMounted = true
      Dimensions.addEventListener('change', () => this.updateScreen())
    }
  
    componentWillUnmount() {
      this._isMounted = false
      Dimensions.removeEventListener('change', () => this.updateScreen())
    }
  
    updateScreen = () => {
      const { height, width } = Dimensions.get('screen')
  
      if (this._isMounted) {
        this.setState({
          screen: {
            orientation: width < height,
            width: width, height: height
          }
        })
      }
    }

}