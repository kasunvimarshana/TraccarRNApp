//https://stackoverflow.com/questions/47683591/react-native-different-styles-applied-on-orientation-change
//https://adrianhall.github.io/react%20native/2017/07/26/handling-orientation-changes-in-react-native/
///////////////////////////////////////////////////////////////////
const getScreenInfo = () => {
    const dim = Dimensions.get('window');
    return dim;
}    

const bindScreenDimensionsUpdate = (component) => {
    Dimensions.addEventListener('change', () => {
        try{
            component.setState({
                orientation: isPortrait() ? 'portrait' : 'landscape',
                screenWidth: getScreenInfo().width,
                screenHeight: getScreenInfo().height
            });
        }catch(e){
            // Fail silently
        }
    });
}
///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
import ScreenMetrics from './globalFunctionContainer';

export default class UserList extends Component {
  constructor(props){
    super(props);

    this.state = {};

    ScreenMetrics.bindScreenDimensionsUpdate(this);
  }
}
///////////////////////////////////////////////////////////////////