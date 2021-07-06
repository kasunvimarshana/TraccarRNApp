//import * as React from 'react';
import React, { Component, useState, useEffect, useCallback, useRef } from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Platform,
    Animated,
    InteractionManager
} from 'react-native';
import { 
    //Colors,
    Text
} from 'react-native-paper';
import { withTheme, useTheme } from 'react-native-paper';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Marker, Polyline, AnimatedRegion } from 'react-native-maps';

import CustomTheme from '../Themes/CustomTheme';
import { sleep } from '../Helpers/AsyncHelper';
import MarkerComponent from './MarkerComponent';

const AnimatedPolyLineComponent = ( props, ref ) => {
    const [ polyLineCoordinates, setPolyLineCoordinates ] = useState([]);
    const [ markerCoordinate, setMarkerCoordinate ] = useState( null );
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const _isMountedRef = useRef(true);
    const markerRef = useRef(null);
    const _polyLineCoordinates_0_Ref = useRef( props.coordinates );
    const _polyLineCoordinates_1_Ref = useRef([]);
    //const _timeoutID_animation = useRef(null);
    const _animation_delay_in_ms = useRef(250);
    //const useMount = func => useEffect(() => func(), []);

    const isAnimatingRef = useRef( false );
    /*const setIsAnimating = useCallback(( isAnimating ) => {
        isAnimatingRef.current = isAnimating;
    }, []);*/
    const setIsAnimating = ( isAnimating ) => {
        isAnimatingRef.current = isAnimating;
    };

    useEffect(() => {
        _isMountedRef.current = true;
        if( _isMountedRef.current ){
            console.log("_isMountedRef.current", _isMountedRef.current);
        }
        //cleanup
        return () => { 
            _isMountedRef.current = false; 
            console.log("cleanup", _isMountedRef.current);
        };
    }, [ props ]);

    useEffect(() => {
        _isMountedRef.current = true;
        if( _isMountedRef.current ){
            console.log("props.coordinates", props.coordinates, _isMountedRef.current);
            set_polyLineCoordinates_0( props.coordinates );
            set_polyLineCoordinates_1( [] );
        }
        //cleanup
        return () => { 
            _isMountedRef.current = false; 
            console.log("cleanup", _isMountedRef.current);
        };
    }, [ props.coordinates ]);

    const animate = async ( isRunning = true ) => {
        console.log("animate", isRunning);
        let new_coordinates = ( _polyLineCoordinates_1_Ref.current ) ? [..._polyLineCoordinates_1_Ref.current] : [];
        let prev_coords = {};
        let coords_value = undefined;
        //setIsAnimating( isRunning );
        //setPolyLineCoordinates( new_coordinates );
        try {
            while(
                ( (_isMountedRef.current) && (isAnimatingRef.current) && ((coords_value = _polyLineCoordinates_0_Ref.current.shift()) !== undefined) ) 
            ) {
                console.log("coords_value", coords_value);
                /*if( (!isAnimatingRef.current) || (!_isMountedRef.current) ){
                    return isAnimatingRef.current;
                }*/
                //if( JSON.stringify( prev_coords ) !== JSON.stringify( coords_value ) ) { }
                //if( Object.entries(prev_coords).toString() === Object.entries(coords_value).toString() ) {}
                /*_polyLineCoordinates_1_Ref.current = Array.prototype.concat( _polyLineCoordinates_1_Ref.current, { 
                    ...coords_value,
                    latitude: coords_value.latitude, 
                    longitude: coords_value.longitude 
                } );*/

                //_polyLineCoordinates_1_Ref.current = Array.prototype.concat( _polyLineCoordinates_1_Ref.current, { ...coords_value } );
                //_polyLineCoordinates_1_Ref.current.push( {...coords_value} );
                //Array.prototype.push.apply( _polyLineCoordinates_1_Ref.current, [{ ...coords_value }] );
                new_coordinates = Array.prototype.concat( new_coordinates, { ...coords_value } );
                set_polyLineCoordinates_1( new_coordinates );

                if( 
                    ( prev_coords.latitude !== coords_value.latitude ) 
                    || ( prev_coords.longitude !== coords_value.longitude )
                ){
                    await sleep( _animation_delay_in_ms.current / 2 );
                    prev_coords = coords_value;
                    setMarkerCoordinate( coords_value );
                    setPolyLineCoordinates( new_coordinates );
                    await onChangeHandler( coords_value );
                    await sleep( _animation_delay_in_ms.current / 2 );
                }
            }
        } catch ( error ) {
            console.log("error", error);
        }
        console.log("isAnimatingRef.current", isAnimatingRef.current);
        setIsAnimating( false );
    };

    const set_polyLineCoordinates_0 = ( coords = [] ) => {
        _polyLineCoordinates_0_Ref.current = (coords) ? [...coords] : [];
    };

    const set_polyLineCoordinates_1 = ( coords = [] ) => {
        _polyLineCoordinates_1_Ref.current = (coords) ? [...coords] : [];
    };

    const onChangeHandler = ( coords ) => {
        return props.onChange(coords);
    };

    const _start = () => {
        if( (_isMountedRef.current) && (!isAnimatingRef.current) ){
            console.log("_start");
            setIsAnimating(true);
            animate( isAnimatingRef.current );
        }
    };

    const _stop = () => {
        if( (_isMountedRef.current) ){
            console.log("_stop");
            setIsAnimating(false);
            set_polyLineCoordinates_0( props.coordinates );
            set_polyLineCoordinates_1( [] );
        }
    };

    const _pause = () => {
        if( (_isMountedRef.current) && (isAnimatingRef.current) ){
            console.log("_pause");
            setIsAnimating( false );
        }
    };

    const _resume = () => {
        if( (_isMountedRef.current) ){
            console.log("_resume");
        }
    };

    React.useImperativeHandle(ref, () => ({
        start: () => {
            _start();
        },
        stop: () => {
            _stop();
        },
        pause: () => {
            _pause();
        },
        resume: () => {
            _resume();
        },
    }));

    return (
        <React.Fragment>
            { console.log("Component") }
            <Polyline 
                coordinates={ props.coordinates }
                strokeColor="#000ff0"
                strokeWidth={ 5 } 
            />
            <Polyline 
                coordinates={ polyLineCoordinates }
                strokeColor="#ff0000"
                strokeWidth={ 5 } 
            />
            {
                markerCoordinate !== null && 
                <MarkerComponent
                    ref={markerRef} 
                    coordinate={ markerCoordinate } 
                    data={ markerCoordinate }
                    markerImage={ props.markerImage }
                />
            }
        </React.Fragment>
    );

};

const { colors } = CustomTheme;

const styles = StyleSheet.create({
    container: {},
});

const animatedPolyLineComponent = React.forwardRef(AnimatedPolyLineComponent);
export default React.memo( animatedPolyLineComponent );