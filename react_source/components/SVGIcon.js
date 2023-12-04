
import { ReactSVG } from 'react-svg';
export default function SVGIcon(props) {
   
    return (
        <ReactSVG
            beforeInjection={(svg) => {
                svg.setAttribute('fill', 'current');
                svg.setAttribute('height', props.style.height ? props.style.height : '100%');
                svg.setAttribute('width', props.style.width ? props.style.width : '100%');
            }}
            src={props.src}
            style={{ ...{ justifyContent: 'center', alignItems: 'center' }, ...styles.icon, ...props.style }} />
    );
   
}

const styles = {
    icon: {
        aspectRatio: 1,
        height: '100%',
    },
};