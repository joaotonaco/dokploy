import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatTimestamp } from "@/lib/utils";

interface NetworkChartProps {
	data: any[];
}

const chartConfig = {
	cpu: {
		label: "CPU",
		color: "hsl(var(--chart-1))",
	},
	memory: {
		label: "Memoria",
		color: "hsl(var(--chart-2))",
	},
	network: {
		label: "Red",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

export function NetworkChart({ data }: NetworkChartProps) {
	const latestData = data[data.length - 1] || {};

	return (
		<Card className="bg-transparent">
			<CardHeader className="border-b py-5">
				<CardTitle>Red</CardTitle>
				<CardDescription>
					Tráfico de red: ↑ {latestData.networkOut} KB/s ↓{" "}
					{latestData.networkIn} KB/s
				</CardDescription>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="fillNetworkIn" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-3))"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-3))"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillNetworkOut" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="hsl(var(--chart-4))"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="hsl(var(--chart-4))"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="timestamp"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => formatTimestamp(value)}
						/>
						<YAxis tickFormatter={(value) => `${value} KB/s`} />
						<ChartTooltip
							cursor={false}
							content={({ active, payload, label }) => {
								if (active && payload && payload.length) {
									const data = payload[0].payload;
									return (
										<div className="rounded-lg border bg-background p-2 shadow-sm">
											<div className="grid grid-cols-2 gap-2">
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														Tiempo
													</span>
													<span className="font-bold">
														{formatTimestamp(label)}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														Red
													</span>
													<span className="font-bold">
														↑ {data.networkOut} KB/s
														<br />↓ {data.networkIn} KB/s
													</span>
												</div>
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<Area
							name="Red Entrada"
							dataKey="networkIn"
							type="monotone"
							fill="url(#fillNetworkIn)"
							stroke="hsl(var(--chart-3))"
							strokeWidth={2}
						/>
						<Area
							name="Red Salida"
							dataKey="networkOut"
							type="monotone"
							fill="url(#fillNetworkOut)"
							stroke="hsl(var(--chart-4))"
							strokeWidth={2}
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
