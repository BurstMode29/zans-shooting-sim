import React, {useState} from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

export default function CardGraph({ title, description, labels, datasets, ...rest }) {
    const [cardWidth, setCardWidth] = useState(0);
    return (
        <Card style={styles.card} {...rest} onLayout={(event) => {
            const {width, height} = event.nativeEvent.layout;
            setCardWidth(width * 90 / 100);
        }}>
            <Card.Title title={title} />
            <Card.Content>
                <Paragraph>
                    {description}
                </Paragraph>
            </Card.Content>
            <Card.Content >
                <LineChart
                    width={cardWidth}
                    height={256}
                    verticalLabelRotation={30}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    data={{ labels, datasets }}
                    bezier
                />
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: { margin: 5 }
});